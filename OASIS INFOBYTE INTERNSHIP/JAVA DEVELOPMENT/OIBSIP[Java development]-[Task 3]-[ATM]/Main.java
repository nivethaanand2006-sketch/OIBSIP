/** Entry point for the ATM simulation. */
public class Main {
    public static void main(String[] args) {
        Bank bank = new Bank();
        new ATM(bank).start();
    }
}
