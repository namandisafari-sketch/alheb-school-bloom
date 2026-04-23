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
      appointments: {
        Row: {
          created_at: string
          created_by: string | null
          duration_minutes: number
          host_name: string | null
          host_staff_id: string | null
          id: string
          learner_id: string | null
          location: string | null
          notes: string | null
          purpose: string
          reminder_enabled: boolean
          scheduled_for: string
          status: string
          updated_at: string
          visitor_id: string | null
          visitor_name: string
          visitor_phone: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          host_name?: string | null
          host_staff_id?: string | null
          id?: string
          learner_id?: string | null
          location?: string | null
          notes?: string | null
          purpose: string
          reminder_enabled?: boolean
          scheduled_for: string
          status?: string
          updated_at?: string
          visitor_id?: string | null
          visitor_name: string
          visitor_phone?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          host_name?: string | null
          host_staff_id?: string | null
          id?: string
          learner_id?: string | null
          location?: string | null
          notes?: string | null
          purpose?: string
          reminder_enabled?: boolean
          scheduled_for?: string
          status?: string
          updated_at?: string
          visitor_id?: string | null
          visitor_name?: string
          visitor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
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
      bursar_override_requests: {
        Row: {
          created_at: string | null
          id: string
          learner_id: string
          outstanding_balance: number | null
          reason: string | null
          requested_by: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          rule_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          learner_id: string
          outstanding_balance?: number | null
          reason?: string | null
          requested_by?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          learner_id?: string
          outstanding_balance?: number | null
          reason?: string | null
          requested_by?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bursar_override_requests_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bursar_override_requests_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "bursar_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      bursar_rules: {
        Row: {
          applies_to_all_classes: boolean
          balance_threshold: number
          class_id: string | null
          created_at: string | null
          id: string
          is_active: boolean
          name: string
          rule_type: string
          updated_at: string | null
        }
        Insert: {
          applies_to_all_classes?: boolean
          balance_threshold?: number
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          rule_type?: string
          updated_at?: string | null
        }
        Update: {
          applies_to_all_classes?: boolean
          balance_threshold?: number
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          rule_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bursar_rules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
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
      emergency_reentry_slips: {
        Row: {
          badge_number: string
          created_at: string
          duration_minutes: number
          expires_at: string
          host_name: string | null
          id: string
          id_number: string | null
          issued_at: string
          issued_by: string | null
          notes: string | null
          original_visit_id: string | null
          print_width: number
          purpose: string | null
          serial: string
          visitor_id: string | null
          visitor_name: string
          visitor_phone: string | null
          voided: boolean
          voided_at: string | null
        }
        Insert: {
          badge_number: string
          created_at?: string
          duration_minutes?: number
          expires_at: string
          host_name?: string | null
          id?: string
          id_number?: string | null
          issued_at?: string
          issued_by?: string | null
          notes?: string | null
          original_visit_id?: string | null
          print_width?: number
          purpose?: string | null
          serial: string
          visitor_id?: string | null
          visitor_name: string
          visitor_phone?: string | null
          voided?: boolean
          voided_at?: string | null
        }
        Update: {
          badge_number?: string
          created_at?: string
          duration_minutes?: number
          expires_at?: string
          host_name?: string | null
          id?: string
          id_number?: string | null
          issued_at?: string
          issued_by?: string | null
          notes?: string | null
          original_visit_id?: string | null
          print_width?: number
          purpose?: string | null
          serial?: string
          visitor_id?: string | null
          visitor_name?: string
          visitor_phone?: string | null
          voided?: boolean
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_reentry_slips_original_visit_id_fkey"
            columns: ["original_visit_id"]
            isOneToOne: false
            referencedRelation: "visitor_visits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_reentry_slips_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_assignments: {
        Row: {
          created_at: string | null
          custom_amount: number | null
          fee_structure_id: string
          id: string
          is_exempted: boolean
          learner_id: string
          notes: string | null
        }
        Insert: {
          created_at?: string | null
          custom_amount?: number | null
          fee_structure_id: string
          id?: string
          is_exempted?: boolean
          learner_id: string
          notes?: string | null
        }
        Update: {
          created_at?: string | null
          custom_amount?: number | null
          fee_structure_id?: string
          id?: string
          is_exempted?: boolean
          learner_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_assignments_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_assignments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          academic_year: number
          amount: number
          collected_by: string | null
          created_at: string | null
          currency: string
          fee_structure_id: string | null
          id: string
          learner_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          receipt_number: string
          reference_number: string | null
          term: string | null
        }
        Insert: {
          academic_year?: number
          amount: number
          collected_by?: string | null
          created_at?: string | null
          currency?: string
          fee_structure_id?: string | null
          id?: string
          learner_id: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          receipt_number: string
          reference_number?: string | null
          term?: string | null
        }
        Update: {
          academic_year?: number
          amount?: number
          collected_by?: string | null
          created_at?: string | null
          currency?: string
          fee_structure_id?: string | null
          id?: string
          learner_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          receipt_number?: string
          reference_number?: string | null
          term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          academic_year: number
          amount: number
          applies_to: string
          category: string
          class_level: number | null
          created_at: string | null
          currency: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          term: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: number
          amount?: number
          applies_to?: string
          category?: string
          class_level?: number | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          term?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: number
          amount?: number
          applies_to?: string
          category?: string
          class_level?: number | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          term?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      in_app_notifications: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_read: boolean
          link: string | null
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      learner_documents: {
        Row: {
          created_at: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          learner_id: string
          mime_type: string | null
          ocr_extracted_data: Json | null
          ocr_status: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          learner_id: string
          mime_type?: string | null
          ocr_extracted_data?: Json | null
          ocr_status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          learner_id?: string
          mime_type?: string | null
          ocr_extracted_data?: Json | null
          ocr_status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learner_documents_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
        ]
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
      notification_logs: {
        Row: {
          channel: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          guardian_id: string | null
          id: string
          learner_id: string | null
          message_content: string
          recipient_name: string | null
          recipient_phone: string
          sent_at: string | null
          status: string | null
          template_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          guardian_id?: string | null
          id?: string
          learner_id?: string | null
          message_content: string
          recipient_name?: string | null
          recipient_phone: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          guardian_id?: string | null
          id?: string
          learner_id?: string | null
          message_content?: string
          recipient_name?: string | null
          recipient_phone?: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          channel: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          message_body: string
          name: string
          subject: string | null
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          channel?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          message_body: string
          name: string
          subject?: string | null
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          message_body?: string
          name?: string
          subject?: string | null
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: []
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
          academic_average: number | null
          academic_position: number | null
          academic_total: number | null
          academic_year: number
          attendance_percentage: number | null
          class_id: string
          class_size: number | null
          class_teacher_remarks: string | null
          cleanliness_rating: string | null
          conduct_rating: Database["public"]["Enums"]["competency_level"] | null
          days_absent: number | null
          days_present: number | null
          discipline_rating: string | null
          generated_at: string | null
          head_teacher_remarks: string | null
          id: string
          islamic_position: number | null
          islamic_teacher_remarks: string | null
          learner_id: string
          overall_competency:
            | Database["public"]["Enums"]["competency_level"]
            | null
          participation_rating: string | null
          published_at: string | null
          published_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          term: Database["public"]["Enums"]["term_type"]
        }
        Insert: {
          academic_average?: number | null
          academic_position?: number | null
          academic_total?: number | null
          academic_year?: number
          attendance_percentage?: number | null
          class_id: string
          class_size?: number | null
          class_teacher_remarks?: string | null
          cleanliness_rating?: string | null
          conduct_rating?:
            | Database["public"]["Enums"]["competency_level"]
            | null
          days_absent?: number | null
          days_present?: number | null
          discipline_rating?: string | null
          generated_at?: string | null
          head_teacher_remarks?: string | null
          id?: string
          islamic_position?: number | null
          islamic_teacher_remarks?: string | null
          learner_id: string
          overall_competency?:
            | Database["public"]["Enums"]["competency_level"]
            | null
          participation_rating?: string | null
          published_at?: string | null
          published_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          term: Database["public"]["Enums"]["term_type"]
        }
        Update: {
          academic_average?: number | null
          academic_position?: number | null
          academic_total?: number | null
          academic_year?: number
          attendance_percentage?: number | null
          class_id?: string
          class_size?: number | null
          class_teacher_remarks?: string | null
          cleanliness_rating?: string | null
          conduct_rating?:
            | Database["public"]["Enums"]["competency_level"]
            | null
          days_absent?: number | null
          days_present?: number | null
          discipline_rating?: string | null
          generated_at?: string | null
          head_teacher_remarks?: string | null
          id?: string
          islamic_position?: number | null
          islamic_teacher_remarks?: string | null
          learner_id?: string
          overall_competency?:
            | Database["public"]["Enums"]["competency_level"]
            | null
          participation_rating?: string | null
          published_at?: string | null
          published_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
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
      salary_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          paid_by: string | null
          payment_date: string
          payment_method: string | null
          reference_number: string | null
          salary_record_id: string
          staff_id: string
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_by?: string | null
          payment_date?: string
          payment_method?: string | null
          reference_number?: string | null
          salary_record_id: string
          staff_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_by?: string | null
          payment_date?: string
          payment_method?: string | null
          reference_number?: string | null
          salary_record_id?: string
          staff_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_payments_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_payments_salary_record_id_fkey"
            columns: ["salary_record_id"]
            isOneToOne: false
            referencedRelation: "salary_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_payments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_records: {
        Row: {
          allowances: number | null
          basic_salary: number
          created_at: string | null
          currency: string | null
          deductions: number | null
          effective_from: string
          effective_to: string | null
          id: string
          net_salary: number | null
          notes: string | null
          staff_id: string
          updated_at: string | null
        }
        Insert: {
          allowances?: number | null
          basic_salary?: number
          created_at?: string | null
          currency?: string | null
          deductions?: number | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          net_salary?: number | null
          notes?: string | null
          staff_id: string
          updated_at?: string | null
        }
        Update: {
          allowances?: number | null
          basic_salary?: number
          created_at?: string | null
          currency?: string | null
          deductions?: number | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          net_salary?: number | null
          notes?: string | null
          staff_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_records_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_notifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          scheduled_for: string
          status: string | null
          target_audience: string
          target_class_id: string | null
          target_learner_ids: string[] | null
          template_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          scheduled_for: string
          status?: string | null
          target_audience: string
          target_class_id?: string | null
          target_learner_ids?: string[] | null
          template_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          scheduled_for?: string
          status?: string | null
          target_audience?: string
          target_class_id?: string | null
          target_learner_ids?: string[] | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_notifications_target_class_id_fkey"
            columns: ["target_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      subjects: {
        Row: {
          category: Database["public"]["Enums"]["subject_category"]
          code: string | null
          created_at: string | null
          display_order: number
          grading_type: Database["public"]["Enums"]["grading_type"]
          id: string
          is_core: boolean | null
          max_class_level: number | null
          min_class_level: number | null
          name: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["subject_category"]
          code?: string | null
          created_at?: string | null
          display_order?: number
          grading_type?: Database["public"]["Enums"]["grading_type"]
          id?: string
          is_core?: boolean | null
          max_class_level?: number | null
          min_class_level?: number | null
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["subject_category"]
          code?: string | null
          created_at?: string | null
          display_order?: number
          grading_type?: Database["public"]["Enums"]["grading_type"]
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
          juz_completed: number | null
          learner_id: string
          letter_grade: string | null
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
          juz_completed?: number | null
          learner_id: string
          letter_grade?: string | null
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
          juz_completed?: number | null
          learner_id?: string
          letter_grade?: string | null
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
      visitor_visits: {
        Row: {
          appointment_id: string | null
          badge_number: string | null
          check_in_at: string
          check_out_at: string | null
          created_at: string
          host_name: string | null
          host_staff_id: string | null
          id: string
          learner_id: string | null
          notes: string | null
          purpose: string | null
          recorded_by: string | null
          status: string
          visitor_id: string | null
          visitor_name: string
          visitor_phone: string | null
          visitor_photo_url: string | null
        }
        Insert: {
          appointment_id?: string | null
          badge_number?: string | null
          check_in_at?: string
          check_out_at?: string | null
          created_at?: string
          host_name?: string | null
          host_staff_id?: string | null
          id?: string
          learner_id?: string | null
          notes?: string | null
          purpose?: string | null
          recorded_by?: string | null
          status?: string
          visitor_id?: string | null
          visitor_name: string
          visitor_phone?: string | null
          visitor_photo_url?: string | null
        }
        Update: {
          appointment_id?: string | null
          badge_number?: string | null
          check_in_at?: string
          check_out_at?: string | null
          created_at?: string
          host_name?: string | null
          host_staff_id?: string | null
          id?: string
          learner_id?: string | null
          notes?: string | null
          purpose?: string | null
          recorded_by?: string | null
          status?: string
          visitor_id?: string | null
          visitor_name?: string
          visitor_phone?: string | null
          visitor_photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitor_visits_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitor_visits_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitor_visits_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      visitors: {
        Row: {
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          full_name: string
          id: string
          id_number: string | null
          is_recurring: boolean
          notes: string | null
          phone: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name: string
          id?: string
          id_number?: string | null
          is_recurring?: boolean
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string
          id?: string
          id_number?: string | null
          is_recurring?: boolean
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
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
      grading_type: "numeric" | "letter" | "descriptive"
      report_status: "draft" | "published" | "locked"
      subject_category: "academic" | "islamic" | "behavior"
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
      grading_type: ["numeric", "letter", "descriptive"],
      report_status: ["draft", "published", "locked"],
      subject_category: ["academic", "islamic", "behavior"],
      term_type: ["term_1", "term_2", "term_3"],
    },
  },
} as const
