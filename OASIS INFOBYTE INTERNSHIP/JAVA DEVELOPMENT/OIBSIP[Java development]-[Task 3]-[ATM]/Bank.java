import java.util.HashMap;
import java.util.Map;

/** Holds all accounts and handles authentication and transfers between them. */
public class Bank {
    private final Map<String, Account> accounts = new HashMap<>();

    public Bank() {
        // Demo accounts
        addAccount(new Account("user1", "1234", 5000.00));
        addAccount(new Account("user2", "4321", 2500.00));
        addAccount(new Account("user3", "1111", 10000.00));
    }

    public void addAccount(Account a) { accounts.put(a.getUserId(), a); }

    public Account find(String userId) { return accounts.get(userId); }

    /** @return the account if ID and PIN match, otherwise null. */
    public Account authenticate(String userId, String pin) {
        Account a = accounts.get(userId);
        return (a != null && a.checkPin(pin)) ? a : null;
    }

    /** @return "OK" or an error message. */
    public String transfer(Account from, String toId, double amount) {
        Account to = accounts.get(toId);
        if (to == null) return "Recipient account not found.";
        if (to == from) return "You cannot transfer to your own account.";
        if (!from.transferOut(amount, toId)) return "Insufficient Funds";
        to.transferIn(amount, from.getUserId());
        return "OK";
    }
}
