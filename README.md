# 📍 Campus Social Scheduler & Pathfinding App

A full-stack web application that helps students manage class schedules, find the shortest walking paths between classes on campus, and discover when and where friends are nearby.

## 🌟 Features

- 🗓️ Schedule management with custom class times and locations.
- 🧭 Real-time shortest path generation between classes using campus graph data.
- 👥 Friend system with mutual friendships.
- 📡 "Nearby" friend detection using spatial quadtree indexing.
- 🔐 Robust API with validation and test coverage.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React (not shown in this repo)
- **Data Structures**: Quadtrees, Graphs (Dijkstra’s Algorithm)
- **Testing**: Mocha, Node Mocks HTTP
- **Data Format**: CSV (for campus edges)
- **Location Computation**: Euclidean distance, centroid calculations

---

## 🚀 Setup & Running Locally

### Prerequisites

- Node.js (v18+)
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/your-username/campus-scheduler.git
cd campus-scheduler
