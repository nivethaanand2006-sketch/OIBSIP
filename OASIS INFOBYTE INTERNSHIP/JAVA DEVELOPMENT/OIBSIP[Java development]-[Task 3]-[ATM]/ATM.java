import java.util.List;
import java.util.Scanner;

/** Console user interface for the ATM. */
public class ATM {
    private final Bank bank;
    private final Scanner sc = new Scanner(System.in);
    private static final int MAX_ATTEMPTS = 3;

    public ATM(Bank bank) { this.bank = bank; }

    public void start() {
        System.out.println("===== WELCOME TO THE ATM =====");
        Account acc = login();
        if (acc == null) {
            System.out.println("Too many incorrect attempts. Access denied.");
            return;
        }
        menu(acc);
        System.out.println("Thank you for banking with us. Goodbye!");
    }

    private Account login() {
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            System.out.print("User ID: ");
            String id = sc.nextLine().trim();
            System.out.print("PIN: ");
            String pin = sc.nextLine().trim();

            Account acc = bank.authenticate(id, pin);
            if (acc != null) {
                System.out.println("Login successful.\n");
                return acc;
            }
            System.out.println("Invalid ID or PIN. Attempts left: " + (MAX_ATTEMPTS - attempt));
        }
        return null;
    }

    private void menu(Account acc) {
        boolean running = true;
        while (running) {
            System.out.println("\n--- MAIN MENU ---");
            System.out.println("1. Transaction History");
            System.out.println("2. Withdraw");
            System.out.println("3. Deposit");
            System.out.println("4. Transfer");
            System.out.println("5. Quit");
            System.out.print("Choose an option: ");

            switch (sc.nextLine().trim()) {
                case "1": showHistory(acc); break;
                case "2": withdraw(acc);    break;
                case "3": deposit(acc);     break;
                case "4": transfer(acc);    break;
                case "5": running = false;  break;
                default:  System.out.println("Invalid option. Please enter 1-5.");
            }
        }
    }

    private void showHistory(Account acc) {
        List<Transaction> h = acc.getHistory();
        System.out.println("\n--- TRANSACTION HISTORY (this session) ---");
        if (h.isEmpty()) System.out.println("No transactions yet.");
        for (Transaction t : h) System.out.println(t);
        System.out.printf("Current balance: %.2f%n", acc.getBalance());
    }

    private void withdraw(Account acc) {
        double amt = readAmount("Amount to withdraw: ");
        if (amt < 0) return;
        if (acc.withdraw(amt)) System.out.printf("Withdrawn %.2f. New balance: %.2f%n", amt, acc.getBalance());
        else System.out.println("Insufficient Funds");
    }

    private void deposit(Account acc) {
        double amt = readAmount("Amount to deposit: ");
        if (amt < 0) return;
        acc.deposit(amt);
        System.out.printf("Deposited %.2f. New balance: %.2f%n", amt, acc.getBalance());
    }

    private void transfer(Account acc) {
        System.out.print("Recipient account ID: ");
        String toId = sc.nextLine().trim();
        double amt = readAmount("Amount to transfer: ");
        if (amt < 0) return;
        String result = bank.transfer(acc, toId, amt);
        if (result.equals("OK")) System.out.printf("Transferred %.2f to %s. New balance: %.2f%n", amt, toId, acc.getBalance());
        else System.out.println(result);
    }

    /** @return a positive amount, or -1 if the input is invalid. */
    private double readAmount(String prompt) {
        System.out.print(prompt);
        try {
            double v = Double.parseDouble(sc.nextLine().trim());
            if (v <= 0) { System.out.println("Amount must be greater than zero."); return -1; }
            return v;
        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid number.");
            return -1;
        }
    }
}
