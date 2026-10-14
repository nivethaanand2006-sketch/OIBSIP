import java.util.Random;
import java.util.Scanner;

public class NumberGuessingGame {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Random rand = new Random();
        int round = 0;
        int roundsWon = 0;
        StringBuilder summary = new StringBuilder();

        System.out.println("=== NUMBER GUESSING GAME ===");

        boolean playing = true;
        while (playing) {
            round++;

            // Difficulty selection (bonus)
            System.out.println("\nChoose difficulty:");
            System.out.println("  1. Easy   (1-50,  10 attempts)");
            System.out.println("  2. Medium (1-100,  7 attempts)");
            System.out.println("  3. Hard   (1-200,  5 attempts)");
            int choice = readInt(sc, "Enter 1, 2 or 3: ", 1, 3);

            int max, maxAttempts;
            if (choice == 1)      { max = 50;  maxAttempts = 10; }
            else if (choice == 2) { max = 100; maxAttempts = 7;  }
            else                  { max = 200; maxAttempts = 5;  }

            int secret = rand.nextInt(max) + 1;
            int attempts = 0;
            boolean won = false;

            System.out.println("\nRound " + round + ": I'm thinking of a number between 1 and " + max + ".");

            while (attempts < maxAttempts) {
                int guess = readInt(sc,
                        "Attempt " + (attempts + 1) + "/" + maxAttempts + " - your guess: ", 1, max);
                attempts++;

                if (guess == secret) {
                    System.out.println("Correct!");
                    won = true;
                    break;
                } else if (guess > secret) {
                    System.out.println("Too High!");
                } else {
                    System.out.println("Too Low!");
                }
            }

            if (won) {
                roundsWon++;
                summary.append("Round ").append(round).append(" - guessed in ")
                       .append(attempts).append(" attempts\n");
            } else {
                System.out.println("You Lost! The number was " + secret + ".");
                summary.append("Round ").append(round).append(" - lost (number was ")
                       .append(secret).append(")\n");
            }

            System.out.print("\nPlay again? (yes/no): ");
            String again = sc.next().trim().toLowerCase();
            playing = again.equals("yes") || again.equals("y");
        }

        System.out.println("\n=== SCORE SUMMARY ===");
        System.out.print(summary);
        System.out.println("Rounds won: " + roundsWon + " / " + round);
        System.out.println("Thanks for playing!");
        sc.close();
    }

    /** Reads an integer within [min, max]; keeps asking until valid. */
    private static int readInt(Scanner sc, String prompt, int min, int max) {
        while (true) {
            System.out.print(prompt);
            if (sc.hasNextInt()) {
                int v = sc.nextInt();
                if (v >= min && v <= max) return v;
                System.out.println("  Please enter a number between " + min + " and " + max + ".");
            } else {
                System.out.println("  That's not a number. Try again.");
                sc.next();   // discard bad token
            }
        }
    }
}
