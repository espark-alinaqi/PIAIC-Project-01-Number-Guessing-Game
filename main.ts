import * as inquirer from 'inquirer';

enum Difficulty {
    Easy = 1,
    Medium = 2,
    Hard = 3,
}

interface GameOptions {
    difficulty: Difficulty;
}

class GuessingGame {
    private secretNumber: number;
    private numberOfGuesses: number;
    private score: number;

    constructor(difficulty: Difficulty) {
        this.secretNumber = this.generateRandomNumber(difficulty);
        this.numberOfGuesses = difficulty * 2;
        this.score = 0;
    }

    private generateRandomNumber(difficulty: Difficulty): number {
        const min = 1;
        const max = difficulty * 10;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private provideHint(): string {
        const isEven = this.secretNumber % 2 === 0;
        return `Hint: The secret number is ${isEven ? 'even' : 'odd'}.`;
    }

    private updateScore(): void {
        this.score += this.numberOfGuesses * 10;
    }

    private async getUserGuess(): Promise<number> {
        const userInput = await inquirer.prompt([
            {
                type: 'input',
                name: 'guess',
                message: `Enter your guess (1-${this.numberOfGuesses * 10}):`,
                validate: (input) => {
                    const number = parseInt(input);
                    return !isNaN(number) && number >= 1 && number <= this.numberOfGuesses * 10;
                },
            },
        ]);

        return parseInt(userInput.guess);
    }

    public async playGame(): Promise<void> {
        console.log('Welcome to the Enhanced Guessing Game!');
        console.log(`I have selected a number between 1 and ${this.numberOfGuesses * 10}. Can you guess it?`);

        while (this.numberOfGuesses > 0) {
            const userGuess = await this.getUserGuess();

            if (userGuess === this.secretNumber) {
                console.log('Congratulations! You guessed the correct number.');
                this.updateScore();
                console.log(`Your score: ${this.score}`);
                return;
            } else {
                console.log(`Incorrect guess. ${this.numberOfGuesses - 1} ${this.numberOfGuesses > 2 ? 'guesses' : 'guess'} left.`);
                this.numberOfGuesses--;

                const promptHint = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'hint',
                        message: 'Do you want a hint?',
                    },
                ]);

                if (promptHint.hint) {
                    console.log(this.provideHint());
                }
            }
        }

        console.log(`Sorry, you've run out of guesses. The correct number was ${this.secretNumber}.`);
        console.log(`Your final score: ${this.score}`);
    }
}

async function startGame(): Promise<void> {
    const options: GameOptions = await inquirer.prompt([
        {
            type: 'list',
            name: 'difficulty',
            message: 'Choose a difficulty level:',
            choices: Object.values(Difficulty),
        },
    ]);

    const game = new GuessingGame(options.difficulty);
    await game.playGame();
}

startGame();
