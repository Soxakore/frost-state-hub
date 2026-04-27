export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alliance_moderators: {
        Row: {
          alliance_id: string
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          alliance_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          alliance_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alliance_moderators_alliance_id_fkey"
            columns: ["alliance_id"]
            isOneToOne: false
            referencedRelation: "alliances"
            referencedColumns: ["id"]
          },
        ]
      }
      alliances: {
        Row: {
          alliance_championship_time: string | null
          bear_trap_time: string | null
          canyon_clash_time: string | null
          contact: string | null
          crazy_joe_time: string | null
          created_at: string
          description: string | null
          foundry_time: string | null
          id: string
          main_language: string | null
          name: string
          power: string | null
          recruiting_status: string
          requirements: string | null
          tag: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alliance_championship_time?: string | null
          bear_trap_time?: string | null
          canyon_clash_time?: string | null
          contact?: string | null
          crazy_joe_time?: string | null
          created_at?: string
          description?: string | null
          foundry_time?: string | null
          id?: string
          main_language?: string | null
          name: string
          power?: string | null
          recruiting_status?: string
          requirements?: string | null
          tag: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alliance_championship_time?: string | null
          bear_trap_time?: string | null
          canyon_clash_time?: string | null
          contact?: string | null
          crazy_joe_time?: string | null
          created_at?: string
          description?: string | null
          foundry_time?: string | null
          id?: string
          main_language?: string | null
          name?: string
          power?: string | null
          recruiting_status?: string
          requirements?: string | null
          tag?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          approved_by: string | null
          category: Database["public"]["Enums"]["announcement_category"]
          created_at: string
          created_by: string | null
          id: string
          message: string
          published_at: string | null
          status: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["announcement_visibility"]
        }
        Insert: {
          approved_by?: string | null
          category?: Database["public"]["Enums"]["announcement_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          message: string
          published_at?: string | null
          status?: string
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["announcement_visibility"]
        }
        Update: {
          approved_by?: string | null
          category?: Database["public"]["Enums"]["announcement_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string
          published_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["announcement_visibility"]
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          record_id: string | null
          role: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          role?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          role?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          instructions: string | null
          local_note: string | null
          name: string
          status: string
          updated_at: string
          updated_by: string | null
          utc_time: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          local_note?: string | null
          name: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          utc_time?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          local_note?: string | null
          name?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          utc_time?: string
        }
        Relationships: []
      }
      governor_board: {
        Row: {
          buff_schedule: Json
          castle_rotation: string | null
          current_governor: string | null
          id: string
          minister_rotation: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          buff_schedule?: Json
          castle_rotation?: string | null
          current_governor?: string | null
          id?: string
          minister_rotation?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          buff_schedule?: Json
          castle_rotation?: string | null
          current_governor?: string | null
          id?: string
          minister_rotation?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      guides: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          disabled: boolean
          display_name: string | null
          email: string | null
          id: string
          in_game_name: string | null
          last_login: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          disabled?: boolean
          display_name?: string | null
          email?: string | null
          id: string
          in_game_name?: string | null
          last_login?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          disabled?: boolean
          display_name?: string | null
          email?: string | null
          id?: string
          in_game_name?: string | null
          last_login?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          alliance: string | null
          created_at: string
          description: string
          id: string
          issue_type: string | null
          reported_player: string | null
          reporter_name: string
          screenshot_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          alliance?: string | null
          created_at?: string
          description: string
          id?: string
          issue_type?: string | null
          reported_player?: string | null
          reporter_name: string
          screenshot_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          alliance?: string | null
          created_at?: string
          description?: string
          id?: string
          issue_type?: string | null
          reported_player?: string | null
          reporter_name?: string
          screenshot_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rules_sections: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      svs_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          updated_by: string | null
          visibility: Database["public"]["Enums"]["announcement_visibility"]
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["announcement_visibility"]
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["announcement_visibility"]
        }
        Relationships: []
      }
      transfer_applications: {
        Row: {
          created_at: string
          current_alliance: string | null
          current_state: string | null
          events_available: string | null
          furnace_level: string | null
          id: string
          in_game_name: string
          message: string | null
          power: string | null
          preferred_alliance: string | null
          private_notes: string | null
          solo_or_group: string | null
          status: string
          time_zone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          current_alliance?: string | null
          current_state?: string | null
          events_available?: string | null
          furnace_level?: string | null
          id?: string
          in_game_name: string
          message?: string | null
          power?: string | null
          preferred_alliance?: string | null
          private_notes?: string | null
          solo_or_group?: string | null
          status?: string
          time_zone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          current_alliance?: string | null
          current_state?: string | null
          events_available?: string | null
          furnace_level?: string | null
          id?: string
          in_game_name?: string
          message?: string | null
          power?: string | null
          preferred_alliance?: string | null
          private_notes?: string | null
          solo_or_group?: string | null
          status?: string
          time_zone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      transfer_settings: {
        Row: {
          contact_info: string | null
          id: string
          looking_for: string | null
          power_cap: string | null
          requirements: string | null
          special_invites: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contact_info?: string | null
          id?: string
          looking_for?: string | null
          power_cap?: string | null
          requirements?: string | null
          special_invites?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contact_info?: string | null
          id?: string
          looking_for?: string | null
          power_cap?: string | null
          requirements?: string | null
          special_invites?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      announcement_category: "State" | "Event" | "Transfer" | "SvS" | "Alliance"
      announcement_visibility: "Public" | "Private"
      app_role:
        | "owner"
        | "governor"
        | "r5_moderator"
        | "r4_moderator"
        | "event_manager"
        | "recruiter"
        | "viewer"
      content_status:
        | "Active"
        | "Open"
        | "Limited"
        | "Closed"
        | "Protected"
        | "War Phase"
        | "Pending"
        | "Published"
        | "Draft"
        | "Weekly"
        | "TBD"
        | "Cancelled"
        | "New"
        | "Reviewing"
        | "Accepted"
        | "Rejected"
        | "Need More Info"
        | "Yes"
        | "No"
        | "Available"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      announcement_category: ["State", "Event", "Transfer", "SvS", "Alliance"],
      announcement_visibility: ["Public", "Private"],
      app_role: [
        "owner",
        "governor",
        "r5_moderator",
        "r4_moderator",
        "event_manager",
        "recruiter",
        "viewer",
      ],
      content_status: [
        "Active",
        "Open",
        "Limited",
        "Closed",
        "Protected",
        "War Phase",
        "Pending",
        "Published",
        "Draft",
        "Weekly",
        "TBD",
        "Cancelled",
        "New",
        "Reviewing",
        "Accepted",
        "Rejected",
        "Need More Info",
        "Yes",
        "No",
        "Available",
      ],
    },
  },
} as const
