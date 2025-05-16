import { applyMove, getBoardStateString, getValidMoves, isSolved } from "../helpers";
import { PriorityQueue } from "../priorityQueue";
import type { Move, PiecesMap, SolutionResult } from "../types";

// status pencarian dalam algoritma greedy
interface SearchState {
  board: string[][]; // Konfigurasi papan saat ini
  pieces: PiecesMap; // Informasi tentang semua kendaraan pada papan
  stateString: string; // Representasi string unik dari status papan (untuk pengecekan status yang sudah dikunjungi)
  heuristic: number; // Nilai heuristik untuk status saat ini
  moves: Move[]; // Daftar langkah yang telah diambil untuk mencapai status ini
  cost: number; // Biaya/jumlah langkah untuk mencapai status ini
}

/**
 * Implementasi algoritma Greedy Best-First Search untuk menyelesaikan puzzle Rush Hour
 * Algoritma ini selalu memilih status dengan nilai heuristik terendah untuk dieksplorasi selanjutnya
 * @param initialBoard Konfigurasi papan awal
 * @param initialPieces Informasi kendaraan awal pada papan
 * @param heuristicFunc Fungsi heuristik yang digunakan untuk menilai jarak ke solusi
 */
const greedy = (initialBoard: string[][], initialPieces: PiecesMap, heuristicFunc: (board: string[][], pieces: PiecesMap) => number): SolutionResult => {
  // Definisikan batasan maksimum biaya untuk mencegah loop tak terhingga
  // Dihitung berdasarkan ukuran papan (tinggi × lebar × 5)
  const MAX_COST = initialBoard.length * initialBoard[0].length * 5;

  // Catat waktu mulai untuk menghitung durasi eksekusi
  const start = performance.now();

  // Set untuk menyimpan status yang sudah dikunjungi
  const visitedStates = new Set<string>();

  // Menggunakan priority queue untuk pemilihan status yang efisien
  // Status dengan nilai heuristik terendah akan dipilih terlebih dahulu
  const openList = new PriorityQueue<SearchState>((a, b) => a.heuristic - b.heuristic);

  // Menghitung jumlah simpul yang dikunjungi
  let nodesVisited = 0;

  // Inisialisasi status awal
  const initialState: SearchState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard), // Mengkonversi board menjadi string unik
    heuristic: heuristicFunc(initialBoard, initialPieces), // Menghitung nilai heuristik awal
    moves: [], // Belum ada langkah yang diambil
    cost: 0, // Biaya awal adalah 0
  };

  // Masukkan status awal ke dalam antrean
  openList.push(initialState);

  // Loop utama pencarian
  while (!openList.isEmpty()) {
    nodesVisited++;

    // Ambil status dengan nilai heuristik terendah
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
    if (currentState.cost > MAX_COST) {
      continue;
    }

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
      const newCost = currentState.cost + 1;

      // Tambahkan ke antrean hanya jika biaya tidak melebihi batas maksimum
      if (newCost <= MAX_COST) {
        const newState: SearchState = {
          board: newBoard,
          pieces: newPieces,
          stateString: newStateString,
          heuristic: newHeuristic,
          moves: [...currentState.moves, move], // Tambahkan langkah baru ke daftar langkah
          cost: newCost,
        };

        // Masukkan status baru ke dalam antrean
        openList.push(newState);
      }
    }

    // Batasan keamanan: berhenti jika terlalu banyak node diperiksa
    if (nodesVisited > 100000) {
      const end = performance.now();
      return {
        solved: false,
        moves: [],
        nodesVisited,
        executionTime: end - start,
      };
    }

    // Pemeriksaan waktu: hentikan jika algoritma berjalan terlalu lama
    if (nodesVisited % 10000 === 0) {
      const currentTime = performance.now();
      if (currentTime - start > 30000) {
        // batas waktu 30 detik
        const end = performance.now();
        return {
          solved: false,
          moves: [],
          nodesVisited,
          executionTime: end - start,
        };
      }
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

export default greedy;
