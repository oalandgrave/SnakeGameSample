import { NgClass, NgFor, NgIf  } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ NgClass, NgFor, NgIf],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  title = 'Snake Game';
  rows = 30;
  cols = 30;
  score = 0;
  highScore = 0;
  interval: string | number | NodeJS.Timeout | undefined;
  defaultDirection = 'right';
  snake = [{ x: 8, y: 10 }];
  apple = { x: 0, y: 0 };

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let key = event.key;
    switch (key) {
      case 'ArrowLeft':
        this.direction('left');
        break;
      case 'ArrowUp':
        this.direction('up');
        break;
      case 'ArrowRight':
        this.direction('right');
        break;
      case 'ArrowDown':
        this.direction('down');
        break;
    }
  }


  generateApple() {
    let collision;
  
    do {
      collision = false;
      this.apple.x = Math.floor(Math.random() * this.rows);
      this.apple.y = Math.floor(Math.random() * this.cols);
  
      // Check if apple collides with the snake
      for (let part of this.snake) {
        if (part.x === this.apple.x && part.y === this.apple.y) {
          collision = true;
          break;
        }
      }
    } while (collision);
  }

  ngOnInit() {
    this.highScore = Number(localStorage.getItem('highScore')) || 0;
    this.generateApple();
    this.interval = setInterval(() => {
      this.move();
    }, 150);
  }

  move() {
    let head = Object.assign({}, this.snake[0]); // copy head object.
  switch (this.defaultDirection) {
    case 'right':
      head.x += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
  }
  if (this.checkCollision(head)) {
    this.gameOver();
    return;
  }
  this.snake.unshift(head);
  if (this.checkApple(head)) {
    this.eatApple();
  } else {
    this.snake.pop(); // remove the tail
  }
   
  }



  checkCollision(head: { x: any; y: any; }) {
    // Check if the snake has collided with the wall
  if (head.x < 0 || head.y < 0 || head.x >= this.rows || head.y >= this.cols) {
    return true;
  }

  // Check if the snake has collided with itself
  for (let i = 1; i < this.snake.length; i++) {
    if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
      return true;
    }
  }

  return false;
  }

  selfHit(head: { x: any; y: any; }) {
    return this.snake.some((e, i) => i !== 0 && e.x === head.x && e.y === head.y);
  }

  checkApple(head: { x: any; y: any; }) {
    return head.x === this.apple.x && head.y === this.apple.y;
  }

  eatApple() {
    let collision;

  do {
    collision = false;
    this.apple.x = Math.floor(Math.random() * this.rows);
    this.apple.y = Math.floor(Math.random() * this.cols);

    // Check if apple collides with the snake
    for (let part of this.snake) {
      if (part.x === this.apple.x && part.y === this.apple.y) {
        collision = true;
        break;
      }
    }
   } while (collision);
    this.score++;
  }

  gameOver() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('highScore', String(this.highScore));
    }
    clearInterval(this.interval);
    alert('Game Over');
    this.resetGame();
  }

  resetGame() {
    this.snake = [{ x: 8, y: 10 }];
    this.apple = { x: Math.floor(Math.random() * this.rows), y: Math.floor(Math.random() * this.cols) };
    this.score = 0;
    this.defaultDirection = 'right';
    this.interval = setInterval(() => {
      this.move();
    }, 200);
  }

  direction(dir: string) {
    if (dir === 'left' && this.defaultDirection !== 'right') {
      this.defaultDirection = dir;
    } else if (dir === 'right' && this.defaultDirection !== 'left') {
      this.defaultDirection = dir;
    } else if (dir === 'up' && this.defaultDirection !== 'down') {
      this.defaultDirection = dir;
    } else if (dir === 'down' && this.defaultDirection !== 'up') {
      this.defaultDirection = dir;
    }
  }

  isApple(i: number, j: number): boolean {
    return this.apple && this.apple.x === i && this.apple.y === j;
  }


  isSnake(i: number, j: number): boolean {
    return this.snake.some(part => part.x === i && part.y === j);
  }
}