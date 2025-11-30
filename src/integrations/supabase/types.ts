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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in_time: string | null
          class_id: string
          created_at: string | null
          date: string
          id: string
          learner_id: string
          notes: string | null
          recorded_by: string | null
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          check_in_time?: string | null
          class_id: string
          created_at?: string | null
          date?: string
          id?: string
          learner_id: string
          notes?: string | null
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          check_in_time?: string | null
          class_id?: string
          created_at?: string | null
          date?: string
          id?: string
          learner_id?: string
          notes?: string | null
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: number | null
          capacity: number | null
          created_at: string | null
          id: string
          level: number
          name: string
          room: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: number | null
          capacity?: number | null
          created_at?: string | null
          id?: string
          level: number
          name: string
          room?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: number | null
          capacity?: number | null
          created_at?: string | null
          id?: string
          level?: number
          name?: string
          room?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          address: string | null
          created_at: string | null
          district: string | null
          email: string | null
          full_name: string
          id: string
          phone: string
          relationship: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone: string
          relationship?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
          relationship?: string | null
        }
        Relationships: []
      }
      learners: {
        Row: {
          admission_number: string | null
          class_id: string | null
          created_at: string | null
          date_of_birth: string | null
          district: string | null
          enrollment_date: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          guardian_id: string | null
          id: string
          photo_url: string | null
          religion: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admission_number?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          district?: string | null
          enrollment_date?: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          guardian_id?: string | null
          id?: string
          photo_url?: string | null
          religion?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admission_number?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          district?: string | null
          enrollment_date?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          guardian_id?: string | null
          id?: string
          photo_url?: string | null
          religion?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learners_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learners_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_learner_links: {
        Row: {
          created_at: string | null
          id: string
          learner_id: string
          parent_user_id: string
          relationship: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          learner_id: string
          parent_user_id: string
          relationship?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          learner_id?: string
          parent_user_id?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_learner_links_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      ple_mock_tests: {
        Row: {
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          id: string
          is_past_paper: boolean | null
          subject: string
          title: string
          total_marks: number | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          is_past_paper?: boolean | null
          subject: string
          title: string
          total_marks?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          is_past_paper?: boolean | null
          subject?: string
          title?: string
          total_marks?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ple_mock_tests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ple_results: {
        Row: {
          attempted_at: string | null
          grade: string | null
          id: string
          learner_id: string
          mock_test_id: string
          remarks: string | null
          score: number
          time_taken_minutes: number | null
        }
        Insert: {
          attempted_at?: string | null
          grade?: string | null
          id?: string
          learner_id: string
          mock_test_id: string
          remarks?: string | null
          score: number
          time_taken_minutes?: number | null
        }
        Update: {
          attempted_at?: string | null
          grade?: string | null
          id?: string
          learner_id?: string
          mock_test_id?: string
          remarks?: string | null
          score?: number
          time_taken_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ple_results_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ple_results_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "ple_mock_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          qualification: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          phone?: string | null
          qualification?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          qualification?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      report_cards: {
        Row: {
          academic_year: number
          attendance_percentage: number | null
          class_id: string
          class_teacher_remarks: string | null
          conduct_rating: Database["public"]["Enums"]["competency_level"] | null
          generated_at: string | null
          head_teacher_remarks: string | null
          id: string
          learner_id: string
          overall_competency:
            | Database["public"]["Enums"]["competency_level"]
            | null
          term: Database["public"]["Enums"]["term_type"]
        }
        Insert: {
          academic_year?: number
          attendance_percentage?: number | null
          class_id: string
          class_teacher_remarks?: string | null
          conduct_rating?:
            | Database["public"]["Enums"]["competency_level"]
            | null
          generated_at?: string | null
          head_teacher_remarks?: string | null
          id?: string
          learner_id: string
          overall_competency?:
            | Database["public"]["Enums"]["competency_level"]
            | null
          term: Database["public"]["Enums"]["term_type"]
        }
        Update: {
          academic_year?: number
          attendance_percentage?: number | null
          class_id?: string
          class_teacher_remarks?: string | null
          conduct_rating?:
            | Database["public"]["Enums"]["competency_level"]
            | null
          generated_at?: string | null
          head_teacher_remarks?: string | null
          id?: string
          learner_id?: string
          overall_competency?:
            | Database["public"]["Enums"]["competency_level"]
            | null
          term?: Database["public"]["Enums"]["term_type"]
        }
        Relationships: [
          {
            foreignKeyName: "report_cards_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_cards_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          is_core: boolean | null
          max_class_level: number | null
          min_class_level: number | null
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          is_core?: boolean | null
          max_class_level?: number | null
          min_class_level?: number | null
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          is_core?: boolean | null
          max_class_level?: number | null
          min_class_level?: number | null
          name?: string
        }
        Relationships: []
      }
      term_results: {
        Row: {
          academic_year: number
          class_id: string
          competency_rating: Database["public"]["Enums"]["competency_level"]
          created_at: string | null
          id: string
          learner_id: string
          recorded_by: string | null
          score: number | null
          subject_id: string
          teacher_remarks: string | null
          term: Database["public"]["Enums"]["term_type"]
          updated_at: string | null
        }
        Insert: {
          academic_year?: number
          class_id: string
          competency_rating: Database["public"]["Enums"]["competency_level"]
          created_at?: string | null
          id?: string
          learner_id: string
          recorded_by?: string | null
          score?: number | null
          subject_id: string
          teacher_remarks?: string | null
          term: Database["public"]["Enums"]["term_type"]
          updated_at?: string | null
        }
        Update: {
          academic_year?: number
          class_id?: string
          competency_rating?: Database["public"]["Enums"]["competency_level"]
          created_at?: string | null
          id?: string
          learner_id?: string
          recorded_by?: string | null
          score?: number | null
          subject_id?: string
          teacher_remarks?: string | null
          term?: Database["public"]["Enums"]["term_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "term_results_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "term_results_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "term_results_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "term_results_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "parent" | "staff"
      attendance_status: "present" | "absent" | "late" | "excused"
      competency_level: "exceeding" | "meeting" | "approaching" | "beginning"
      gender_type: "male" | "female"
      term_type: "term_1" | "term_2" | "term_3"
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
      app_role: ["admin", "teacher", "parent", "staff"],
      attendance_status: ["present", "absent", "late", "excused"],
      competency_level: ["exceeding", "meeting", "approaching", "beginning"],
      gender_type: ["male", "female"],
      term_type: ["term_1", "term_2", "term_3"],
    },
  },
} as const
