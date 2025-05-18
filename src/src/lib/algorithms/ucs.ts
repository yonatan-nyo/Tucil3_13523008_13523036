import applyMove from "../helpers/applyMove";
import getBoardStateString from "../helpers/getBoardStateString";
import getValidMoves from "../helpers/getValidMoves";
import isSolved from "../helpers/isSolved";
import { PriorityQueue } from "../priorityQueue";
import type { Move, PiecesMap, SolutionResult } from "../types";

// status pencarian dalam algoritma UCS
interface SearchState {
  board: string[][]; // Konfigurasi papan saat ini
  pieces: PiecesMap; // Informasi tentang semua kendaraan pada papan
  stateString: string; // Representasi string unik dari status papan
  cost: number; // Biaya/jumlah langkah yang telah diambil untuk mencapai status ini
  moves: Move[]; // Daftar langkah yang telah diambil untuk mencapai status ini
}

interface Solution {
  cost: number; // Biaya total solusi (jumlah langkah)
  moves: Move[]; // Daftar langkah untuk mencapai solusi
}

/**
 * Implementasi algoritma Uniform Cost Search (UCS) untuk menemukan solusi optimal
 * UCS memilih node dengan biaya terendah untuk dieksplorasi, menjamin solusi optimal
 * @param initialBoard Konfigurasi papan awal
 * @param initialPieces Informasi kendaraan awal pada papan
 */
const ucs = (initialBoard: string[][], initialPieces: PiecesMap): SolutionResult => {
  // Definisikan batasan maksimum biaya untuk mencegah loop tak terhingga
  const MAX_COST = initialBoard.length * initialBoard[0].length * 50;

  const start = performance.now();

  // Set untuk menyimpan status yang sudah dikunjungi
  const visitedStates = new Set<string>();

  // Menggunakan priority queue untuk pemilihan status yang efisien dengan status yang biaya terendah akan dipilih terlebih dahulu
  const openList = new PriorityQueue<SearchState>((a, b) => a.cost - b.cost);

  // Menghitung jumlah simpul yang dikunjungi
  let nodesVisited = 0;

  // Inisialisasi status awal
  const initialState: SearchState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard), // Mengkonversi board menjadi string unik
    cost: 0, // Biaya awal adalah 0
    moves: [], // Belum ada langkah yang diambil
  };

  // Masukkan status awal ke dalam antrean
  openList.push(initialState);

  // Variabel untuk menyimpan solusi terbaik yang ditemukan
  let bestSolution: Solution = {
    cost: Infinity, // Inisialisasi dengan biaya tak terhingga
    moves: [], // Belum ada solusi ditemukan
  };

  while (!openList.isEmpty()) {
    nodesVisited++;

    // Ambil status dengan biaya terendah
    const currentState = openList.pop()!;

    // Lewati jika status ini sudah dikunjungi sebelumnya
    if (visitedStates.has(currentState.stateString)) continue;
    visitedStates.add(currentState.stateString);

    // cek apakah status saat ini adalah solusi
    if (isSolved(currentState.pieces)) {
      // Perbarui solusi terbaik jika ini adalah solusi dengan biaya lebih rendah
      if (!bestSolution || currentState.cost < bestSolution.cost) {
        bestSolution = {
          cost: currentState.cost,
          moves: [...currentState.moves],
        };
      }

      // Hitung waktu eksekusi dan kembalikan solusi
      const end = performance.now();
      return {
        solved: true,
        moves: currentState.moves, // Daftar langkah menuju solusi
        nodesVisited, // Jumlah node yang diperiksa
        executionTime: end - start, // Waktu eksekusi dalam milidetik
      };
    }

    // Lewati jika biaya sudah melebihi batas maksimum (skip infinite loop)
    if (currentState.cost > MAX_COST) continue;

    // Dapatkan semua langkah yang valid dari status saat ini
    const validMoves = getValidMoves(currentState.board, currentState.pieces);

    // Iterasi melalui semua langkah yang mungkin
    for (const move of validMoves) {
      const result = applyMove(currentState.board, currentState.pieces, move);
      const newStateString = getBoardStateString(result.board);

      // Lewati status yang sudah dikunjungi sebelumnya
      if (visitedStates.has(newStateString)) continue;

      // Buat status baru dengan biaya yang diperbarui
      const newState: SearchState = {
        board: result.board,
        pieces: result.pieces,
        stateString: newStateString,
        cost: currentState.cost + 1, // Cost increases by 1
        moves: [...currentState.moves, move], // Tambahkan langkah baru ke daftar langkah
      };

      // Masukkan status baru ke dalam antrean
      openList.push(newState);
    }
  }

  // Jika antrean kosong
  const end = performance.now();
  return {
    solved: bestSolution.cost !== Infinity,
    moves: bestSolution.moves,
    nodesVisited,
    executionTime: end - start,
  };
};

export default ucs;
