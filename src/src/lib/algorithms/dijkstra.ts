import applyMove from "../helpers/applyMove";
import getBoardStateString from "../helpers/getBoardStateString";
import getValidMoves from "../helpers/getValidMoves";
import isSolved from "../helpers/isSolved";
import { PriorityQueue } from "../priorityQueue";
import type { Move, PiecesMap, SolutionResult } from "../types";

// status pencarian dalam algoritma Dijkstra
interface SearchState {
  board: string[][]; // Konfigurasi papan saat ini
  pieces: PiecesMap; // Informasi tentang semua kendaraan pada papan
  stateString: string; // Representasi string unik dari status papan
  cost: number; // Biaya/jarak dari node awal ke node ini
  moves: Move[]; // Daftar langkah yang telah diambil untuk mencapai status ini
}

/**
 * Implementasi algoritma Dijkstra untuk menyelesaikan puzzle Rush Hour
 * Dijkstra mencari jalur terpendek dengan memprioritaskan node dengan biaya terendah
 * Mirip dengan UCS, tetapi menggunakan pendekatan yang berbeda untuk pelacakan node yang dikunjungi
 * @param initialBoard Konfigurasi papan awal
 * @param initialPieces Informasi kendaraan awal pada papan
 */
const dijkstra = (initialBoard: string[][], initialPieces: PiecesMap): SolutionResult => {
  // Batasan maksimum biaya untuk mencegah loop tak terhingga
  const MAX_COST = initialBoard.length * initialBoard[0].length * 50;

  const start = performance.now();

  // Map untuk menyimpan biaya terendah yang diketahui untuk setiap state
  const distanceMap = new Map<string, number>();

  // Priority queue untuk menyimpan state yang akan dieksplorasi dan state dengan biaya terendah akan diproses terlebih dahulu
  const queue = new PriorityQueue<SearchState>((a, b) => a.cost - b.cost);

  // Hitung jumlah node yang dikunjungi
  let nodesVisited = 0;

  // Inisialisasi state awal
  const initialState: SearchState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard),
    cost: 0,
    moves: [],
  };

  // Tambahkan state awal ke queue dan distance map
  queue.push(initialState);
  distanceMap.set(initialState.stateString, 0);

  while (!queue.isEmpty()) {
    nodesVisited++;

    // Ambil state dengan biaya terendah
    const currentState = queue.pop()!;
    const currentStateString = currentState.stateString;

    // Jika biaya state ini lebih tinggi dari yang sudah diketahui, lewati
    if (currentState.cost > (distanceMap.get(currentStateString) || Infinity)) {
      continue;
    }

    // cek solusi bukan
    if (isSolved(currentState.pieces)) {
      const end = performance.now();
      return {
        solved: true,
        moves: currentState.moves,
        nodesVisited,
        executionTime: end - start,
      };
    }

    // Lewati jika biaya terlalu tinggi (skip infinite loop)
    if (currentState.cost > MAX_COST) {
      continue;
    }

    // cari langkah valid
    const validMoves = getValidMoves(currentState.board, currentState.pieces);

    // Eksplorasi semua langkah yang valid
    for (const move of validMoves) {
      // Terapkan langkah untuk mendapatkan state baru
      const { board: newBoard, pieces: newPieces } = applyMove(currentState.board, currentState.pieces, move);
      const newStateString = getBoardStateString(newBoard);

      // Hitung biaya baru untuk mencapai state ini
      const newCost = currentState.cost + 1;

      // Jika ditemukan jalur yang lebih pendek atau state baru belum dikunjungi
      if (newCost < (distanceMap.get(newStateString) || Infinity)) {
        // Perbarui jarak terpendek ke state ini
        distanceMap.set(newStateString, newCost);

        // Buat state baru dan tambahkan ke queue
        const newState: SearchState = {
          board: newBoard,
          pieces: newPieces,
          stateString: newStateString,
          cost: newCost,
          moves: [...currentState.moves, move],
        };

        queue.push(newState);
      }
    }
  }

  // Jika queue kosong dan tidak ditemukan solusi
  const end = performance.now();
  return {
    solved: false,
    moves: [],
    nodesVisited,
    executionTime: end - start,
  };
};

export default dijkstra;
