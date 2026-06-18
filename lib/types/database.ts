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
        Relationships: []
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
        Relationships: []
      }

      products: {
        Row: {
          id: string
          series_type_id: string
          name: string
          season: string
          total_cards: number | null
          total_base: number | null
          total_master: number | null
          binder_slots_per_page: number
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
          total_base?: number | null
          total_master?: number | null
          binder_slots_per_page?: number
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
          total_base?: number | null
          total_master?: number | null
          binder_slots_per_page?: number
          release_date?: string | null
          cover_image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }

      teams: {
        Row: {
          id: string
          name: string
          short_name: string | null
          league: string | null
          logo_url: string | null
          crest_cached_url: string | null
          external_id: string | null
          color_primary: string | null
          color_secondary: string | null
          country: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          league?: string | null
          logo_url?: string | null
          crest_cached_url?: string | null
          external_id?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          country?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          league?: string | null
          logo_url?: string | null
          crest_cached_url?: string | null
          external_id?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          country?: string
          created_at?: string
        }
        Relationships: []
      }

      product_teams: {
        Row: {
          product_id: string
          team_id: string
          sort_order: number
          group_phase: string | null
        }
        Insert: {
          product_id: string
          team_id: string
          sort_order?: number
          group_phase?: string | null
        }
        Update: {
          product_id?: string
          team_id?: string
          sort_order?: number
          group_phase?: string | null
        }
        Relationships: []
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
        Relationships: []
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
          card_type: 'base' | 'insert' | 'parallel'
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
          card_type?: 'base' | 'insert' | 'parallel'
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
          card_type?: 'base' | 'insert' | 'parallel'
          print_run?: number | null
          is_autograph?: boolean
          is_rookie?: boolean
          parent_card_id?: string | null
          image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cards_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cards_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cards_rarity_id_fkey'
            columns: ['rarity_id']
            isOneToOne: false
            referencedRelation: 'rarities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'price_snapshots_card_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'price_snapshots'
            referencedColumns: ['card_id']
          },
          {
            foreignKeyName: 'user_collections_card_id_fkey'
            columns: ['id']
            isOneToOne: false
            referencedRelation: 'user_collections'
            referencedColumns: ['card_id']
          },
        ]
      }

      user_profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          favorite_team_id: string | null
          is_public: boolean
          showcase_public: boolean
          notify_threshold: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          favorite_team_id?: string | null
          is_public?: boolean
          showcase_public?: boolean
          notify_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          favorite_team_id?: string | null
          is_public?: boolean
          showcase_public?: boolean
          notify_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      user_showcase: {
        Row: {
          user_id: string
          card_id: string
          grid_position: number
          created_at: string
        }
        Insert: {
          user_id: string
          card_id: string
          grid_position: number
          created_at?: string
        }
        Update: {
          user_id?: string
          card_id?: string
          grid_position?: number
          created_at?: string
        }
        Relationships: []
      }

      acquisition_events: {
        Row: {
          id: string
          user_id: string
          card_id: string
          acquired_at: string
          source: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          acquired_at?: string
          source?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          acquired_at?: string
          source?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
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
          acquired_at: string | null
          acquisition_source: string | null
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
          acquired_at?: string | null
          acquisition_source?: string | null
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
          acquired_at?: string | null
          acquisition_source?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_collections_card_id_fkey'
            columns: ['card_id']
            isOneToOne: false
            referencedRelation: 'cards'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'price_snapshots_card_id_fkey'
            columns: ['card_id']
            isOneToOne: true
            referencedRelation: 'cards'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: []
      }
      user_set_progress: {
        Row: {
          user_id: string | null
          product_id: string | null
          product_name: string | null
          season: string | null
          base_total: number | null
          master_total: number | null
          base_owned: number | null
          master_owned: number | null
          pct_base: number | null
          pct_master: number | null
          last_acquired_at: string | null
        }
        Relationships: []
      }
      user_club_progress: {
        Row: {
          user_id: string | null
          product_id: string | null
          team_id: string | null
          team_name: string | null
          short_name: string | null
          crest_cached_url: string | null
          logo_url: string | null
          color_primary: string | null
          color_secondary: string | null
          total_cards: number | null
          owned_cards: number | null
          pct_owned: number | null
        }
        Relationships: []
      }
      product_club_totals: {
        Row: {
          product_id: string | null
          team_id: string | null
          total_cards: number | null
          base_cards: number | null
        }
        Relationships: []
      }
    }

    Functions: {}
    Enums: {}
    CompositeTypes: {}
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
export type UserSetProgress = Database['public']['Views']['user_set_progress']['Row']
export type UserClubProgress = Database['public']['Views']['user_club_progress']['Row']
export type AcquisitionEvent = Database['public']['Tables']['acquisition_events']['Row']
export type CardType = 'base' | 'insert' | 'parallel'

// Types enrichis (avec joins)
export type CardWithDetails = Card & {
  products: Pick<Product, 'id' | 'name' | 'season'> | null
  teams: Pick<Team, 'id' | 'name' | 'short_name' | 'logo_url'> | null
  rarities: Pick<Rarity, 'id' | 'name' | 'level' | 'color_hex'> | null
  price_snapshots: PriceSnapshot | null
  user_collections?: Pick<UserCollection, 'status' | 'quantity' | 'condition'> | null
}

export type CollectionStatus = 'owned' | 'missing' | 'wanted' | null
