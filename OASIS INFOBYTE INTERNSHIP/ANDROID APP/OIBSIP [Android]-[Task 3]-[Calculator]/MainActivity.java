package com.example.calculator;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

/**
 * Simple calculator. Supports + - x /, decimal point, clear, backspace and
 * division-by-zero handling. Operator chaining is evaluated left to right
 * (5 + 3 x 2 = 16), like a basic pocket calculator.
 */
public class MainActivity extends AppCompatActivity {

    private TextView display;
    private final StringBuilder current = new StringBuilder(); // number being typed
    private double accumulator = 0;
    private String pendingOp = null;
    private boolean error = false;
    private boolean justEvaluated = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        display = findViewById(R.id.display);

        int[] digitIds = {R.id.btn0, R.id.btn1, R.id.btn2, R.id.btn3, R.id.btn4,
                R.id.btn5, R.id.btn6, R.id.btn7, R.id.btn8, R.id.btn9};
        for (int i = 0; i < digitIds.length; i++) {
            final String d = String.valueOf(i);
            findViewById(digitIds[i]).setOnClickListener(v -> onDigit(d));
        }
        findViewById(R.id.btnDot).setOnClickListener(v -> onDot());
        findViewById(R.id.btnAdd).setOnClickListener(v -> onOperator("+"));
        findViewById(R.id.btnSub).setOnClickListener(v -> onOperator("-"));
        findViewById(R.id.btnMul).setOnClickListener(v -> onOperator("×"));
        findViewById(R.id.btnDiv).setOnClickListener(v -> onOperator("÷"));
        findViewById(R.id.btnEq).setOnClickListener(v -> onEquals());
        findViewById(R.id.btnClear).setOnClickListener(v -> onClear());
        findViewById(R.id.btnBack).setOnClickListener(v -> onBackspace());
    }

    private void onDigit(String d) {
        if (error) onClear();
        if (justEvaluated) { current.setLength(0); pendingOp = null; justEvaluated = false; }
        if (current.length() >= 15) return;                       // avoid overflow
        if (current.toString().equals("0")) current.setLength(0); // no leading zeros
        current.append(d);
        refresh();
    }

    private void onDot() {
        if (error) onClear();
        if (justEvaluated) { current.setLength(0); pendingOp = null; justEvaluated = false; }
        if (current.indexOf(".") >= 0) return;
        if (current.length() == 0) current.append("0");
        current.append(".");
        refresh();
    }

    private void onOperator(String op) {
        if (error) return;
        if (current.length() > 0) {
            applyPending();
            if (error) return;
        } else if (pendingOp == null) {
            accumulator = 0;                                      // operator pressed first
        }
        pendingOp = op;
        current.setLength(0);
        justEvaluated = false;
        display.setText(format(accumulator) + " " + op);
    }

    private void onEquals() {
        if (error || pendingOp == null || current.length() == 0) return;
        applyPending();
        if (error) return;
        pendingOp = null;
        current.setLength(0);
        current.append(format(accumulator));
        justEvaluated = true;
        refresh();
    }

    /** Applies pendingOp using accumulator and the number being typed. */
    private void applyPending() {
        double value = Double.parseDouble(current.toString());
        if (pendingOp == null) { accumulator = value; return; }
        switch (pendingOp) {
            case "+": accumulator += value; break;
            case "-": accumulator -= value; break;
            case "×": accumulator *= value; break;
            case "÷":
                if (value == 0) { showError(); return; }
                accumulator /= value;
                break;
        }
    }

    private void onBackspace() {
        if (error) { onClear(); return; }
        if (current.length() > 0) {
            current.deleteCharAt(current.length() - 1);
            refresh();
        }
    }

    private void onClear() {
        current.setLength(0);
        accumulator = 0;
        pendingOp = null;
        error = false;
        justEvaluated = false;
        display.setText("0");
    }

    private void showError() {
        error = true;
        current.setLength(0);
        pendingOp = null;
        display.setText("Error");
    }

    private void refresh() {
        String text = current.length() == 0 ? "0" : current.toString();
        display.setText(text);
    }

    /** 12.0 -> "12", 0.5 -> "0.5" */
    private String format(double v) {
        if (v == Math.rint(v) && Math.abs(v) < 1e15) return String.valueOf((long) v);
        return String.valueOf(v);
    }
}
