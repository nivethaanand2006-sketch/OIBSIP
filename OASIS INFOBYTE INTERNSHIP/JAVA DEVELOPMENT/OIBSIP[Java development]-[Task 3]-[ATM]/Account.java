import java.util.ArrayList;
import java.util.List;

/** Bank account with encapsulated state and an ArrayList transaction history. */
public class Account {
    private final String userId;
    private final String pin;
    private double balance;
    private final List<Transaction> history = new ArrayList<>();

    public Account(String userId, String pin, double openingBalance) {
        this.userId = userId;
        this.pin = pin;
        this.balance = openingBalance;
    }

    public String getUserId() { return userId; }
    public double getBalance() { return balance; }
    public List<Transaction> getHistory() { return history; }

    public boolean checkPin(String candidate) { return pin.equals(candidate); }

    public void deposit(double amount) {
        balance += amount;
        history.add(new Transaction("Deposit", amount, balance, "Cash deposit"));
    }

    /** @return false when funds are insufficient. */
    public boolean withdraw(double amount) {
        if (amount > balance) return false;
        balance -= amount;
        history.add(new Transaction("Withdraw", amount, balance, "Cash withdrawal"));
        return true;
    }

    /** Debit side of a transfer. */
    public boolean transferOut(double amount, String toId) {
        if (amount > balance) return false;
        balance -= amount;
        history.add(new Transaction("Transfer Out", amount, balance, "To " + toId));
        return true;
    }

    /** Credit side of a transfer. */
    public void transferIn(double amount, String fromId) {
        balance += amount;
        history.add(new Transaction("Transfer In", amount, balance, "From " + fromId));
    }
}
