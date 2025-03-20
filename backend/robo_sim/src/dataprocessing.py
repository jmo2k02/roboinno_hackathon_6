from dataclasses import dataclass
import numpy as np
import threading
import csv
import time
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import matplotlib.animation as animation
from pathlib import Path
from pathlib import Path

@dataclass
class WindowConfig:
    '''
    this class is configuring all necessary parameters for each window in the Visualisation Panal
    '''
    title: str
    xlim: tuple
    ylim: tuple

class VisualisationPanal:
    '''
    this class is configuring all necessary parameters for the Visualisation Panal
    '''
    def __init__(self,xAxes,ChooseWindowForVariable,numWindow,widthWindow,heightWindow,frames,WindowConfigs,reference = None):
        self.ChooseWindowForVariable = ChooseWindowForVariable
        self.fildnames = xAxes + list(self.ChooseWindowForVariable.keys())
        self.numWindow = numWindow
        self.widthWindow = widthWindow
        self.heightWindow = heightWindow
        self.frames = frames
        self.WindowConfigs = WindowConfigs
        self.data_file = Path(__file__).parent / "data" / "visualisationData.csv" # "ref_with_cable.csv" # "visualisationData.csv"
        self.data_file_ref = reference
        self.initDataFile()
        self.visData_ready = threading.Event()

    def initDataFile(self):
        """
        Writes the header row to the CSV file (wipes previous content).
        """
        with open(self.data_file, 'w', newline='') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=self.fildnames) 
            writer.writeheader()

    def collect_data(self,data):
        """
        Appends a single row of data to the CSV file.
        """
        with open(self.data_file, 'a', newline='') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=self.fildnames) 
            writer.writerow(data)

    def wait_for_data(self):
        """Wait until the first data point is available, then set the event."""
        while not self.visData_ready.is_set():
            try:
                visData = pd.read_csv(self.data_file)
                if not visData.empty:
                    self.visData_ready.set()
            except FileNotFoundError:
                pass  
            time.sleep(0.05)

    def initVisualisationPanal(self):

        plt.rcParams.update({
            "text.usetex": True,
            "font.family": "computer-modern",  # Change to 'sans-serif' or 'monospace' or "serif" if needed
            "font.size": 14          # Global font size
        })

        fig, axes = plt.subplots(len(self.WindowConfigs), 1, figsize=(self.widthWindow, self.heightWindow))
        fig.subplots_adjust(hspace=0.8)

        lines = [axes[idx].plot([], [], lw=2, label="Optimized",color = [0, 0.7569, 0.7137])[0] for key, idx in self.ChooseWindowForVariable.items()] #label=key

        # Customizing the frame
        for i, ax in enumerate(axes):
            ax.spines["top"].set_linewidth(1.2)
            ax.spines["right"].set_linewidth(1.2)
            ax.spines["left"].set_linewidth(1.2)
            ax.spines["bottom"].set_linewidth(1.2)
            ax.set_facecolor("#f5f5f5")
            ax.grid(True, linestyle="--", linewidth=0.6, alpha=0.7)
            ax.legend(loc="upper right", fontsize=12)
            ax.set_xlabel(r"\textbf{Time (s)}", fontsize=16, labelpad=10)
            #ax.set_xlabel("Time (s)",fontsize=12)
            #ax.set_title(self.WindowConfigs[i].title)
            ax.set_title(r"\textbf{" + self.WindowConfigs[i].title + "}", fontsize=18, pad=15)
            ax.set_xlim(self.WindowConfigs[i].xlim)
            ax.set_ylim(self.WindowConfigs[i].ylim)
                
        return fig, axes, lines
    
    def startAnimation(self):
        self.wait_for_data()
        fig, axes, lines = self.initVisualisationPanal()
        data_file = self.data_file

        # dashed lines that the denote the start of the optimization
        axes[0].axvline(x=4.55, color='black', linestyle='--', linewidth=2) 
        axes[0].axhline(y=0, color='black', linestyle='--', linewidth=2) 
        axes[1].axvline(x=4.55, color='black', linestyle='--', linewidth=2) 
        axes[2].axvline(x=4.55, color='black', linestyle='--', linewidth=2) 
        axes[2].axhline(y=20, color='black', linestyle='--', linewidth=2) 

        if self.data_file_ref is not None:
            visData_ref = pd.read_csv(self.data_file_ref)
            
            t = visData_ref["t"].to_numpy()
            det_J = visData_ref["det(Jacobian)"].to_numpy()
            l2 = visData_ref["L2 norm"].to_numpy()
            cable_mis = visData_ref["Cable Misalignment"].to_numpy()

            axes[0].plot(t,det_J, color="black",linewidth=2, label="Not Optimized")
            axes[0].legend()
            axes[1].plot(t,l2, color="black",linewidth=2, label='Not Optimized')
            axes[1].legend()
            axes[2].plot(t,cable_mis, color="black",linewidth=2, label='Not Optimized')
            axes[2].legend()

        def step(i,fig,axes,lines):
            visData = pd.read_csv(data_file)
            
            t = visData["t"] 
            for count, key in enumerate(self.ChooseWindowForVariable):
                lines[count].set_data(t, visData[key])   

            if t.iloc[-1]+ 0.5 > axes[0].get_xlim()[1]:
                for ax in axes:
                    ax.set_xlim(axes[0].get_xlim()[0], t.iloc[-1] + 5)
                fig.canvas.draw()
            return lines
        
        interval = int(1000/self.frames)
        ani = FuncAnimation(fig, step, interval=interval,fargs=(fig,axes,lines), blit=True) #, save_count=100
        
        plt.show()
        #ani.save("movie.mp4")

def collect_data(data,data_file = Path.cwd() / "data" / "visualisationData.csv"):
    """
    Appends a single row of data to the CSV file.
    """
    with open(data_file, 'a', newline='') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=data.keys()) 
        writer.writerow(data)