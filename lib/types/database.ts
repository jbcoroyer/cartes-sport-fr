// Types générés depuis le schéma Supabase (001_initial_schema.sql)
// À régénérer avec : npx supabase gen types typescript --local > lib/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      publishers: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          created_at?: string
        }
      }

      series_types: {
        Row: {
          id: string
          publisher_id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          publisher_id: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          publisher_id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }

      products: {
        Row: {
          id: string
          series_type_id: string
          name: string
          season: string
          total_cards: number | null
          release_date: string | null
          cover_image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          series_type_id: string
          name: string
          season: string
          total_cards?: number | null
          release_date?: string | null
          cover_image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          series_type_id?: string
          name?: string
          season?: string
          total_cards?: number | null
          release_date?: string | null
          cover_image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }

      teams: {
        Row: {
          id: string
          name: string
          short_name: string | null
          league: string | null
          logo_url: string | null
          country: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          league?: string | null
          logo_url?: string | null
          country?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          league?: string | null
          logo_url?: string | null
          country?: string
          created_at?: string
        }
      }

      rarities: {
        Row: {
          id: string
          product_id: string
          name: string
          level: number
          color_hex: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          level?: number
          color_hex?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          level?: number
          color_hex?: string | null
          description?: string | null
          created_at?: string
        }
      }

      cards: {
        Row: {
          id: string
          product_id: string
          rarity_id: string | null
          team_id: string | null
          card_number: string
          player_name: string
          position: string | null
          variant_type: string
          print_run: number | null
          is_autograph: boolean
          is_rookie: boolean
          parent_card_id: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          rarity_id?: string | null
          team_id?: string | null
          card_number: string
          player_name: string
          position?: string | null
          variant_type?: string
          print_run?: number | null
          is_autograph?: boolean
          is_rookie?: boolean
          parent_card_id?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          rarity_id?: string | null
          team_id?: string | null
          card_number?: string
          player_name?: string
          position?: string | null
          variant_type?: string
          print_run?: number | null
          is_autograph?: boolean
          is_rookie?: boolean
          parent_card_id?: string | null
          image_url?: string | null
          created_at?: string
        }
      }

      user_profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      user_collections: {
        Row: {
          id: string
          user_id: string
          card_id: string
          status: 'owned' | 'missing' | 'wanted'
          quantity: number
          condition: 'mint' | 'near_mint' | 'good' | 'fair' | 'poor' | null
          purchase_price: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          status: 'owned' | 'missing' | 'wanted'
          quantity?: number
          condition?: 'mint' | 'near_mint' | 'good' | 'fair' | 'poor' | null
          purchase_price?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          status?: 'owned' | 'missing' | 'wanted'
          quantity?: number
          condition?: 'mint' | 'near_mint' | 'good' | 'fair' | 'poor' | null
          purchase_price?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      price_history: {
        Row: {
          id: string
          card_id: string
          price: number
          source: 'leboncoin' | 'vinted' | 'ebay' | 'internal'
          sold_at: string | null
          recorded_at: string
          listing_url: string | null
        }
        Insert: {
          id?: string
          card_id: string
          price: number
          source: 'leboncoin' | 'vinted' | 'ebay' | 'internal'
          sold_at?: string | null
          recorded_at?: string
          listing_url?: string | null
        }
        Update: {
          id?: string
          card_id?: string
          price?: number
          source?: 'leboncoin' | 'vinted' | 'ebay' | 'internal'
          sold_at?: string | null
          recorded_at?: string
          listing_url?: string | null
        }
      }

      price_snapshots: {
        Row: {
          card_id: string
          last_price: number | null
          avg_price_7d: number | null
          avg_price_30d: number | null
          min_price_30d: number | null
          max_price_30d: number | null
          sales_count_30d: number
          trend: 'up' | 'down' | 'stable' | null
          refreshed_at: string
        }
        Insert: {
          card_id: string
          last_price?: number | null
          avg_price_7d?: number | null
          avg_price_30d?: number | null
          min_price_30d?: number | null
          max_price_30d?: number | null
          sales_count_30d?: number
          trend?: 'up' | 'down' | 'stable' | null
          refreshed_at?: string
        }
        Update: {
          card_id?: string
          last_price?: number | null
          avg_price_7d?: number | null
          avg_price_30d?: number | null
          min_price_30d?: number | null
          max_price_30d?: number | null
          sales_count_30d?: number
          trend?: 'up' | 'down' | 'stable' | null
          refreshed_at?: string
        }
      }
    }

    Views: {
      user_completion: {
        Row: {
          user_id: string | null
          product_id: string | null
          product_name: string | null
          owned_count: number | null
          missing_count: number | null
          total_cards: number | null
          completion_pct: number | null
        }
      }
    }

    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Helpers pour les types courants
export type Card = Database['public']['Tables']['cards']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type Rarity = Database['public']['Tables']['rarities']['Row']
export type UserCollection = Database['public']['Tables']['user_collections']['Row']
export type PriceSnapshot = Database['public']['Tables']['price_snapshots']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']

// Types enrichis (avec joins)
export type CardWithDetails = Card & {
  products: Pick<Product, 'id' | 'name' | 'season'> | null
  teams: Pick<Team, 'id' | 'name' | 'short_name' | 'logo_url'> | null
  rarities: Pick<Rarity, 'id' | 'name' | 'level' | 'color_hex'> | null
  price_snapshots: PriceSnapshot | null
  user_collections?: Pick<UserCollection, 'status' | 'quantity' | 'condition'> | null
}

export type CollectionStatus = 'owned' | 'missing' | 'wanted' | null
