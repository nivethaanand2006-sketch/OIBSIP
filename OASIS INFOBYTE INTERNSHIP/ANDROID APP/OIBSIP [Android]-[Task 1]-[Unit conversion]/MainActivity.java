package com.example.unitconverter;

import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

/** Unit converter for Length, Weight and Temperature. */
public class MainActivity extends AppCompatActivity {

    private static final String[] CATEGORIES = {"Length", "Weight", "Temperature"};

    // Factors express each unit in a base unit (metres for length, grams for weight).
    private static final Map<String, Double> LENGTH = new LinkedHashMap<>();
    private static final Map<String, Double> WEIGHT = new LinkedHashMap<>();
    private static final String[] TEMPS = {"Celsius", "Fahrenheit", "Kelvin"};

    static {
        LENGTH.put("Millimetres", 0.001);
        LENGTH.put("Centimetres", 0.01);
        LENGTH.put("Metres", 1.0);
        LENGTH.put("Kilometres", 1000.0);
        LENGTH.put("Inches", 0.0254);
        LENGTH.put("Feet", 0.3048);
        LENGTH.put("Miles", 1609.344);

        WEIGHT.put("Grams", 1.0);
        WEIGHT.put("Kilograms", 1000.0);
        WEIGHT.put("Milligrams", 0.001);
        WEIGHT.put("Ounces", 28.349523125);
        WEIGHT.put("Pounds", 453.59237);
    }

    private Spinner categorySpinner, fromSpinner, toSpinner;
    private EditText input;
    private TextView result;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        categorySpinner = findViewById(R.id.categorySpinner);
        fromSpinner = findViewById(R.id.fromSpinner);
        toSpinner = findViewById(R.id.toSpinner);
        input = findViewById(R.id.inputValue);
        result = findViewById(R.id.resultText);
        Button convert = findViewById(R.id.convertButton);

        categorySpinner.setAdapter(new ArrayAdapter<>(this,
                android.R.layout.simple_spinner_dropdown_item, CATEGORIES));

        // Switching category resets the unit dropdowns and the result.
        categorySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String[] units = unitsFor(CATEGORIES[position]);
                ArrayAdapter<String> adapter = new ArrayAdapter<>(MainActivity.this,
                        android.R.layout.simple_spinner_dropdown_item, units);
                fromSpinner.setAdapter(adapter);
                toSpinner.setAdapter(adapter);
                if (units.length > 1) toSpinner.setSelection(1);
                result.setText("");
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) { }
        });

        convert.setOnClickListener(v -> convertValue());
    }

    private String[] unitsFor(String category) {
        switch (category) {
            case "Length":      return LENGTH.keySet().toArray(new String[0]);
            case "Weight":      return WEIGHT.keySet().toArray(new String[0]);
            default:            return TEMPS;
        }
    }

    private void convertValue() {
        String text = input.getText().toString().trim();
        if (text.isEmpty()) {
            Toast.makeText(this, "Please enter a value", Toast.LENGTH_SHORT).show();
            return;
        }
        double value;
        try {
            value = Double.parseDouble(text);
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Please enter a valid number", Toast.LENGTH_SHORT).show();
            return;
        }

        String category = (String) categorySpinner.getSelectedItem();
        String from = (String) fromSpinner.getSelectedItem();
        String to = (String) toSpinner.getSelectedItem();

        double out;
        if (category.equals("Temperature")) {
            out = convertTemperature(value, from, to);
            if (Double.isNaN(out)) {
                Toast.makeText(this, "Temperature is below absolute zero", Toast.LENGTH_SHORT).show();
                return;
            }
        } else {
            Map<String, Double> table = category.equals("Length") ? LENGTH : WEIGHT;
            out = value * table.get(from) / table.get(to);
        }

        result.setText(String.format(Locale.US, "%s %s = %s %s",
                trim(value), from, trim(out), to));
    }

    /** @return NaN when the input is below absolute zero. */
    private double convertTemperature(double v, String from, String to) {
        double c;
        switch (from) {
            case "Fahrenheit": c = (v - 32) * 5 / 9; break;
            case "Kelvin":     c = v - 273.15;       break;
            default:           c = v;
        }
        if (c < -273.15) return Double.NaN;
        switch (to) {
            case "Fahrenheit": return c * 9 / 5 + 32;
            case "Kelvin":     return c + 273.15;
            default:           return c;
        }
    }

    private String trim(double d) {
        return String.format(Locale.US, "%.4f", d).replaceAll("0+$", "").replaceAll("\\.$", "");
    }
}
