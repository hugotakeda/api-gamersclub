export interface PlayerProfile {
    nickname: string | null
    level: number | null
    kda: number | null
  }
  
  export interface Match {
    id: string | null
    date: string | null
    result: string | null
    score: string | null
    map: string | null
  }
  
  export interface PlayerStats {
    kda: number | null
    headshot: number | null
    winrate: number | null
    kills: number | null
    deaths: number | null
    assists: number | null
  }
  
  export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
  }
  