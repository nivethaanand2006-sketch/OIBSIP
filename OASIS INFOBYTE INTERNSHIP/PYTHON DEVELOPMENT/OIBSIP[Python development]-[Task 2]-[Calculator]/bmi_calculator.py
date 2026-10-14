


def get_positive_float(prompt: str) -> float:
    """Keep asking until the user enters a valid positive number."""
    while True:
        raw = input(prompt).strip()
        try:
            value = float(raw)
        except ValueError:
            print("  ⚠ That's not a number. Please enter digits only (e.g. 68.5).")
            continue
        if value <= 0:
            print("  ⚠ Value must be positive. Please try again.")
            continue
        return value


def classify_bmi(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"


def calculate_bmi(weight_kg: float, height_m: float) -> float:
    return weight_kg / (height_m ** 2)


def main():
    print("=" * 40)
    print("        BMI CALCULATOR")
    print("=" * 40)

    while True:
        weight = get_positive_float("Enter your weight in kg: ")
        height = get_positive_float("Enter your height in m (e.g. 1.75): ")

        bmi = calculate_bmi(weight, height)
        category = classify_bmi(bmi)

        print("-" * 40)
        print(f"Your BMI is: {bmi:.2f}")
        print(f"Category:    {category}")
        print("-" * 40)

        again = input("Calculate another? (y/n): ").strip().lower()
        if again != "y":
            print("Stay healthy! Goodbye.")
            break


if __name__ == "__main__":
    main()
