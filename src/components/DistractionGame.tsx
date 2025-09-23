import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle } from "lucide-react";

const colors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

export const DistractionGame = ({ onComplete }: { onComplete: () => void }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'showing' | 'playing' | 'complete'>('waiting');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 8)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setGamePhase('showing');
    setScore(0);
    setLevel(1);
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveIndex(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveIndex(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setGamePhase('playing');
  };

  const handleColorClick = (index: number) => {
    if (gamePhase !== 'playing') return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Check if current move is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Game over
      setGamePhase('complete');
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      setScore(score + sequence.length * 10);
      setLevel(level + 1);
      
      if (level >= 5) {
        setGamePhase('complete');
        return;
      }

      // Add new color to sequence
      setTimeout(() => {
        const newSequence = [...sequence, Math.floor(Math.random() * 8)];
        setSequence(newSequence);
        setPlayerSequence([]);
        setGamePhase('showing');
        showSequence(newSequence);
      }, 1000);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Memory Game</h3>
        <p className="text-muted-foreground">
          Follow the color sequence to keep your mind occupied and focused
        </p>
        
        <div className="flex justify-center gap-4">
          <Badge variant="outline">Level {level}</Badge>
          <Badge variant="outline">Score {score}</Badge>
        </div>
      </div>

      {gamePhase === 'waiting' && (
        <div className="space-y-4">
          <Button onClick={startGame} size="lg" className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Start Game
          </Button>
          <Card className="p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Watch the sequence of colors, then repeat it by clicking the colors in the same order.
              Complete 5 levels to finish the game!
            </p>
          </Card>
        </div>
      )}

      {gamePhase === 'showing' && (
        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-primary font-medium">Watch the sequence...</p>
        </Card>
      )}

      {gamePhase === 'playing' && (
        <Card className="p-4 bg-success/10 border-success/20">
          <p className="text-success font-medium">Now repeat the sequence!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Progress: {playerSequence.length}/{sequence.length}
          </p>
        </Card>
      )}

      {gamePhase === 'complete' && (
        <Card className="p-6 bg-gradient-calm space-y-4">
          <h4 className="text-lg font-semibold text-foreground">
            {level >= 5 ? 'Congratulations!' : 'Good Try!'}
          </h4>
          <p className="text-muted-foreground">
            {level >= 5 
              ? `You completed all 5 levels! Final score: ${score}` 
              : `You reached level ${level} with a score of ${score}`
            }
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={startGame} variant="outline">
              Play Again
            </Button>
            <Button onClick={onComplete} variant="default">
              Done Playing
            </Button>
          </div>
        </Card>
      )}

      {(gamePhase === 'showing' || gamePhase === 'playing') && (
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`
                w-16 h-16 rounded-lg transition-all duration-200 
                ${color} 
                ${activeIndex === index ? 'scale-110 brightness-150 shadow-lg' : 'brightness-75 hover:brightness-90'}
                ${gamePhase === 'playing' ? 'cursor-pointer' : 'cursor-default'}
              `}
              onClick={() => handleColorClick(index)}
              disabled={gamePhase !== 'playing'}
            />
          ))}
        </div>
      )}
    </div>
  );
};