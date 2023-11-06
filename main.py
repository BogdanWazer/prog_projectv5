import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

def calculate_pension():
    try:
        initial_contribution = float(initial_contribution_entry.get())
        annual_contribution = float(annual_contribution_entry.get())
        annual_interest_rate = float(annual_interest_rate_entry.get()) / 100
        years = int(years_entry.get())

        future_values = [initial_contribution]
        for year in range(1, years + 1):
            future_values.append(future_values[-1] + annual_contribution)
            future_values[-1] *= (1 + annual_interest_rate)

        plot_results(years, future_values)
    except ValueError:
        messagebox.showerror("Помилка", "Будь ласка, введіть правильні дані.")

def plot_results(years, future_values):
    plt.figure()
    plt.plot(range(years + 1), future_values)
    plt.title("Динаміка накопичення пенсійного капіталу")
    plt.xlabel("Роки")
    plt.ylabel("Сума")
    plt.grid(True)

    canvas = FigureCanvasTkAgg(plt.gcf(), master=main_window)
    canvas_widget = canvas.get_tk_widget()
    canvas_widget.grid(row=7, column=0, columnspan=4)

main_window = tk.Tk()
main_window.title("Розрахунок пенсійного капіталу")

# Створення і розташування елементів GUI
initial_contribution_label = ttk.Label(main_window, text="Початковий внесок:")
initial_contribution_label.grid(row=0, column=0)
initial_contribution_entry = ttk.Entry(main_window)
initial_contribution_entry.grid(row=0, column=1)

annual_contribution_label = ttk.Label(main_window, text="Щорічний внесок:")
annual_contribution_label.grid(row=1, column=0)
annual_contribution_entry = ttk.Entry(main_window)
annual_contribution_entry.grid(row=1, column=1)

annual_interest_rate_label = ttk.Label(main_window, text="Річна ставка (%):")
annual_interest_rate_label.grid(row=2, column=0)
annual_interest_rate_entry = ttk.Entry(main_window)
annual_interest_rate_entry.grid(row=2, column=1)

years_label = ttk.Label(main_window, text="Тривалість вкладу в роках:")
years_label.grid(row=3, column=0)
years_entry = ttk.Entry(main_window)
years_entry.grid(row=3, column=1)

calculate_button = ttk.Button(main_window, text="Розрахувати", command=calculate_pension)
calculate_button.grid(row=4, column=0, columnspan=2)

main_window.mainloop()
