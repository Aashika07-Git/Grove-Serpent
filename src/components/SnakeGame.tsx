import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const GAME_SPEED = 120; // ms per tick

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirectionRef = useRef<Point>({ x: 0, y: -1 });

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for game controls
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (isGameOver) {
       if (e.key === ' ' || e.key === 'Enter') resetGame();
       return;
    }

    if (e.key === ' ') {
       setIsPaused(p => !p);
       return;
    }

    if (isPaused) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isGameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const currentDir = nextDirectionRef.current;
        directionRef.current = currentDir;

        const head = prev[0];
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            setHighScore(h => Math.max(h, newScore));
            return newScore;
          });

          let newFood;
          while (true) {
            newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
            if (!newSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
          }
          setFood(newFood);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isGameOver, isPaused, food]);

  const resetGame = () => {
    setSnake([{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }]);
    directionRef.current = { x: 0, y: -1 };
    nextDirectionRef.current = { x: 0, y: -1 };
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
  };

  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    
    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = !isHead && snake.some(s => s.x === x && s.y === y);
    const isFood = food.x === x && food.y === y;

    let cellClass = "bg-slate-900/40 border border-slate-800/30";
    
    if (isHead) {
      cellClass = "bg-fuchsia-400 shadow-[0_0_12px_#e879f9] rounded-sm z-10 relative";
    } else if (isBody) {
      cellClass = "bg-fuchsia-600/80 shadow-[0_0_8px_#c026d3] rounded-sm relative";
    } else if (isFood) {
      cellClass = "bg-cyan-400 shadow-[0_0_12px_#22d3ee] rounded-full animate-[pulse_1s_ease-in-out_infinite] z-10 relative scale-75";
    }

    return <div key={i} className={cellClass} />;
  });

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[500px]">
      <div className="flex justify-between items-center w-full px-5 py-3 bg-slate-900/50 backdrop-blur-md border border-fuchsia-500/50 rounded-xl shadow-[0_0_15px_rgba(232,121,249,0.2)]">
        <div className="flex flex-col">
          <span className="text-xs text-fuchsia-400/80 font-mono tracking-widest">SCORE</span>
          <span className="text-3xl font-bold font-mono text-fuchsia-300 [text-shadow:0_0_12px_rgba(232,121,249,0.8)] leading-none mt-1">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-cyan-400/80 font-mono tracking-widest">HI-SCORE</span>
          <span className="text-3xl font-bold font-mono text-cyan-300 [text-shadow:0_0_12px_rgba(34,211,238,0.8)] leading-none mt-1">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative group w-[320px] sm:w-[450px] aspect-square flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-700"></div>
        
        <div className="relative w-full h-full bg-slate-950 border-2 border-slate-700/50 rounded-xl overflow-hidden shadow-2xl p-1 z-10 flex">
          <div 
            className="w-full h-full grid gap-[1px]"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
            }}
          >
            {gridCells}
          </div>

          {(isGameOver || isPaused) && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center px-4">
              <h2 className={`text-4xl sm:text-5xl font-black font-mono mb-4 tracking-tight ${isGameOver ? 'text-fuchsia-500 [text-shadow:0_0_20px_#d946ef]' : 'text-cyan-400 [text-shadow:0_0_20px_#22d3ee]'}`}>
                {isGameOver ? 'GAME OVER' : 'PAUSED'}
              </h2>
              <p className="text-slate-400 font-mono text-sm sm:text-base mb-8">
                {isGameOver ? `Final Score: ${score}` : 'Press SPACE to resume'}
              </p>
              
              {isGameOver && (
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 bg-fuchsia-500/10 border-2 border-fuchsia-500 text-fuchsia-400 font-mono font-bold rounded-full hover:bg-fuchsia-500 flex hover:text-white shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.8)] transition-all uppercase tracking-widest"
                >
                  Play Again
                </button>
              )}
              {isPaused && !isGameOver && (
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-cyan-500/10 border-2 border-cyan-500 text-cyan-400 font-mono font-bold rounded-full hover:bg-cyan-500 hover:text-cyan-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all uppercase tracking-widest"
                >
                  Resume
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-slate-500 font-mono text-xs sm:text-sm text-center max-w-[340px] leading-relaxed">
        Use <kbd className="border border-slate-600 rounded px-1.5 py-0.5 text-slate-300">W</kbd> <kbd className="border border-slate-600 rounded px-1.5 py-0.5 text-slate-300">A</kbd> <kbd className="border border-slate-600 rounded px-1.5 py-0.5 text-slate-300">S</kbd> <kbd className="border border-slate-600 rounded px-1.5 py-0.5 text-slate-300">D</kbd> to move. <kbd className="border border-slate-600 rounded px-1.5 py-0.5 text-slate-300 bg-slate-800">Space</kbd> to pause.
      </div>
    </div>
  );
}
