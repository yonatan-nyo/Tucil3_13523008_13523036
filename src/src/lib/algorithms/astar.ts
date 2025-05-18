import applyMove from "../helpers/applyMove";
import getBoardStateString from "../helpers/getBoardStateString";
import getValidMoves from "../helpers/getValidMoves";
import isSolved from "../helpers/isSolved";
import { PriorityQueue } from "../priorityQueue";
import type { Move, PiecesMap, SolutionResult } from "../types";

// status pencarian dalam algoritma A*
interface SearchState {
  board: string[][]; // Konfigurasi papan saat ini
  pieces: PiecesMap; // Informasi tentang semua kendaraan pada papan
  stateString: string; // Representasi string unik dari status papan
  cost: number; // Biaya/jumlah langkah yang telah diambil (nilai g)
  heuristic: number; // Nilai heuristik untuk status saat ini (nilai h)
  f: number; // Nilai total f = g + h, yang digunakan untuk prioritas dalam pencarian
  moves: Move[]; // Daftar langkah yang telah diambil untuk mencapai status ini
}

/**
 * Implementasi algoritma A* Search untuk menyelesaikan puzzle Rush Hour
 * A* menggunakan kombinasi biaya sejauh ini (g) dan estimasi biaya ke tujuan (h)
 * untuk menentukan urutan eksplorasi node
 * @param initialBoard Konfigurasi papan awal
 * @param initialPieces Informasi kendaraan awal pada papan
 * @param heuristicFunc Fungsi heuristik yang digunakan untuk menilai jarak ke solusi
 */
const astar = (initialBoard: string[][], initialPieces: PiecesMap, heuristicFunc: (board: string[][], pieces: PiecesMap) => number): SolutionResult => {
  // Definisikan batasan maksimum biaya untuk mencegah loop tak terhingga
  // Dihitung berdasarkan ukuran papan (tinggi × lebar × 25)
  const MAX_COST = initialBoard.length * initialBoard[0].length * 50;

  // Catat waktu mulai untuk menghitung durasi eksekusi
  const start = performance.now();

  // Set untuk menyimpan status yang sudah dikunjungi
  const visitedStates = new Set<string>();

  // Menggunakan priority queue untuk pemilihan status yang efisien
  // Status dengan nilai f (g + h) terendah akan dipilih terlebih dahulu
  const openList = new PriorityQueue<SearchState>((a, b) => a.f - b.f);

  // Menghitung jumlah simpul yang dikunjungi
  let nodesVisited = 0;

  // Inisialisasi status awal
  const initialState: SearchState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard), // Mengkonversi board menjadi string unik
    cost: 0, // Biaya awal adalah 0
    heuristic: heuristicFunc(initialBoard, initialPieces), // Menghitung nilai heuristik awal
    f: heuristicFunc(initialBoard, initialPieces), // Nilai f awal sama dengan heuristik karena g = 0
    moves: [], // Belum ada langkah yang diambil
  };

  // Masukkan status awal ke dalam antrean
  openList.push(initialState);

  // Loop utama pencarian
  while (!openList.isEmpty()) {
    nodesVisited++;

    // Ambil status dengan nilai f (g + h) terendah
    const currentState = openList.pop()!;

    // Lewati jika status ini sudah dikunjungi sebelumnya
    if (visitedStates.has(currentState.stateString)) continue;
    visitedStates.add(currentState.stateString);

    // Periksa apakah status saat ini adalah solusi
    if (isSolved(currentState.pieces)) {
      const end = performance.now();
      return {
        solved: true,
        moves: currentState.moves, // Daftar langkah menuju solusi
        nodesVisited, // Jumlah node yang diperiksa
        executionTime: end - start, // Waktu eksekusi dalam milidetik
      };
    }

    // Lewati jika biaya sudah melebihi batas maksimum
    if (currentState.cost > MAX_COST) continue;

    // Dapatkan semua langkah yang valid dari status saat ini
    const validMoves = getValidMoves(currentState.board, currentState.pieces);

    // Iterasi melalui semua langkah yang mungkin
    for (const move of validMoves) {
      // Terapkan langkah dan dapatkan status baru
      const { board: newBoard, pieces: newPieces } = applyMove(currentState.board, currentState.pieces, move);
      const newStateString = getBoardStateString(newBoard);

      // Lewati status yang sudah dikunjungi sebelumnya
      if (visitedStates.has(newStateString)) continue;

      // Hitung nilai heuristik dan biaya baru
      const newHeuristic = heuristicFunc(newBoard, newPieces);
      const newCost = currentState.cost + 1; // Biaya bertambah 1

      // Lewati jika melebihi batas maksimum biaya
      if (newCost > MAX_COST) continue;

      // Buat status baru dengan nilai f = g + h
      const newState: SearchState = {
        board: newBoard,
        pieces: newPieces,
        stateString: newStateString,
        cost: newCost, // Nilai g
        heuristic: newHeuristic, // Nilai h
        f: newCost + newHeuristic, // Nilai f = g + h
        moves: [...currentState.moves, move], // Tambahkan langkah baru ke daftar langkah
      };

      // Masukkan status baru ke dalam antrean
      openList.push(newState);
    }
  }

  // Jika antrean kosong dan tidak ditemukan solusi
  const end = performance.now();
  return {
    solved: false,
    moves: [],
    nodesVisited,
    executionTime: end - start,
  };
};

export default astar;
