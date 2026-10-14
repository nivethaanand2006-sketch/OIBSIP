package com.example.stopwatch;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.Locale;

/**
 * Stopwatch with Start / Stop / Reset and Lap (bonus).
 * Time is derived from SystemClock.elapsedRealtime(), so the display stays correct
 * even when the activity is paused and resumed.
 */
public class MainActivity extends AppCompatActivity {

    private TextView timeText;
    private Button startBtn, stopBtn, resetBtn, lapBtn;
    private ListView lapList;
    private final ArrayList<String> laps = new ArrayList<>();
    private ArrayAdapter<String> lapAdapter;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean running = false;
    private long startRealtime = 0;     // elapsedRealtime when (re)started
    private long accumulatedMs = 0;     // time banked from earlier runs

    private final Runnable ticker = new Runnable() {
        @Override
        public void run() {
            timeText.setText(format(currentElapsed()));
            if (running) handler.postDelayed(this, 30);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        timeText = findViewById(R.id.timeText);
        startBtn = findViewById(R.id.startBtn);
        stopBtn = findViewById(R.id.stopBtn);
        resetBtn = findViewById(R.id.resetBtn);
        lapBtn = findViewById(R.id.lapBtn);
        lapList = findViewById(R.id.lapList);
        lapAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, laps);
        lapList.setAdapter(lapAdapter);

        startBtn.setOnClickListener(v -> start());
        stopBtn.setOnClickListener(v -> stop());
        resetBtn.setOnClickListener(v -> reset());
        lapBtn.setOnClickListener(v -> lap());

        if (savedInstanceState != null) {
            running = savedInstanceState.getBoolean("running");
            startRealtime = savedInstanceState.getLong("startRealtime");
            accumulatedMs = savedInstanceState.getLong("accumulatedMs");
            laps.addAll(savedInstanceState.getStringArrayList("laps"));
            lapAdapter.notifyDataSetChanged();
        }
        updateButtons();
        timeText.setText(format(currentElapsed()));
    }

    private long currentElapsed() {
        return running ? accumulatedMs + (SystemClock.elapsedRealtime() - startRealtime) : accumulatedMs;
    }

    private void start() {
        if (running) return;
        running = true;
        startRealtime = SystemClock.elapsedRealtime();
        handler.post(ticker);
        updateButtons();
    }

    private void stop() {
        if (!running) return;
        accumulatedMs = currentElapsed();
        running = false;
        handler.removeCallbacks(ticker);
        timeText.setText(format(accumulatedMs));
        updateButtons();
    }

    private void reset() {
        running = false;
        handler.removeCallbacks(ticker);
        accumulatedMs = 0;
        laps.clear();
        lapAdapter.notifyDataSetChanged();
        timeText.setText(format(0));
        updateButtons();
    }

    private void lap() {
        if (!running) return;
        laps.add(0, "Lap " + (laps.size() + 1) + "   " + format(currentElapsed()));
        lapAdapter.notifyDataSetChanged();
    }

    private void updateButtons() {
        startBtn.setEnabled(!running);
        stopBtn.setEnabled(running);
        lapBtn.setEnabled(running);
        resetBtn.setEnabled(running || accumulatedMs > 0);
    }

    /** MM:SS.cc (or HH:MM:SS.cc once past an hour). */
    private String format(long ms) {
        long hours = ms / 3_600_000;
        long minutes = (ms / 60_000) % 60;
        long seconds = (ms / 1000) % 60;
        long centis = (ms / 10) % 100;
        if (hours > 0) return String.format(Locale.US, "%02d:%02d:%02d.%02d", hours, minutes, seconds, centis);
        return String.format(Locale.US, "%02d:%02d.%02d", minutes, seconds, centis);
    }

    // ----- lifecycle: stop UI updates when hidden, catch up when visible -----
    @Override
    protected void onPause() {
        super.onPause();
        handler.removeCallbacks(ticker);   // the clock itself keeps counting (elapsedRealtime)
    }

    @Override
    protected void onResume() {
        super.onResume();
        timeText.setText(format(currentElapsed()));
        if (running) handler.post(ticker);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        out.putBoolean("running", running);
        out.putLong("startRealtime", startRealtime);
        out.putLong("accumulatedMs", accumulatedMs);
        out.putStringArrayList("laps", laps);
    }
}
