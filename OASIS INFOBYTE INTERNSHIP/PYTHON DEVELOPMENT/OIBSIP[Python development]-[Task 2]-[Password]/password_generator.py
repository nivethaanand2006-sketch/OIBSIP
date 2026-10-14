

import random
import string


def get_length() -> int:
    while True:
        raw = input("Enter desired password length (minimum 8): ").strip()
        if not raw.isdigit():
            print("  ⚠ Please enter a whole number.")
            continue
        length = int(raw)
        if length < 8:
            print("  ⚠ Length must be at least 8 characters.")
            continue
        return length


def get_character_types() -> str:
    print("\nWhich character types should the password include?")
    print("  (Select at least 2. Answer y/n for each.)")

    pool = ""
    types_selected = 0

    if input("  Include UPPERCASE letters? (y/n): ").strip().lower() == "y":
        pool += string.ascii_uppercase
        types_selected += 1
    if input("  Include lowercase letters? (y/n): ").strip().lower() == "y":
        pool += string.ascii_lowercase
        types_selected += 1
    if input("  Include numbers?          (y/n): ").strip().lower() == "y":
        pool += string.digits
        types_selected += 1
    if input("  Include symbols?          (y/n): ").strip().lower() == "y":
        pool += string.punctuation
        types_selected += 1

    if types_selected < 2:
        print("  ⚠ You must select at least 2 character types. Let's try again.\n")
        return get_character_types()

    return pool


def generate_password(length: int, pool: str) -> str:
    return "".join(random.choice(pool) for _ in range(length))


def main():
    print("=" * 40)
    print("      RANDOM PASSWORD GENERATOR")
    print("=" * 40)

    while True:
        length = get_length()
        pool = get_character_types()
        password = generate_password(length, pool)

        print("-" * 40)
        print(f"Generated password: {password}")
        print("-" * 40)

        again = input("Generate another password? (y/n): ").strip().lower()
        if again != "y":
            print("Stay secure! Goodbye.")
            break


if __name__ == "__main__":
    main()
