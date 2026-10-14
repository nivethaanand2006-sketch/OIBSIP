import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/** A single record in an account's history. */
public class Transaction {
    private final String type;      // Deposit, Withdraw, Transfer In, Transfer Out
    private final double amount;
    private final double balanceAfter;
    private final String note;
    private final LocalDateTime time;

    public Transaction(String type, double amount, double balanceAfter, String note) {
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.note = note;
        this.time = LocalDateTime.now();
    }

    public String getType() { return type; }
    public double getAmount() { return amount; }
    public double getBalanceAfter() { return balanceAfter; }

    @Override
    public String toString() {
        String t = time.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return String.format("%s | %-12s | %10.2f | balance %10.2f | %s", t, type, amount, balanceAfter, note);
    }
}
