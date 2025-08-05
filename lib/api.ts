import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface PaymentIntentRequest {
  monto: number;
  tipo: 'SUSCRIPCION' | 'CURSO_INDIVIDUAL';
  suscripcionId?: number;
  cursoId?: number;
}

export interface SubscriptionRequest {
  priceId: string;
  suscripcionId: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  transaccionId: number;
}

export interface SubscriptionResponse {
  clientSecret: string;
  subscriptionId: string;
  transaccionId: number;
}

class PaymentsAPI {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No authenticated session found');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  async createPaymentIntent(data: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/stripe/create-payment-intent`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    return response.json();
  }

  async createSubscription(data: SubscriptionRequest): Promise<SubscriptionResponse> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/stripe/create-subscription`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create subscription');
    }

    return response.json();
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/stripe/cancel-subscription`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel subscription');
    }
  }

  // API para suscripciones
  async createSuscripcion(data: {
    curso_id: number;
    tipo: 'mensual' | 'anual';
  }) {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create subscription');
    }

    return response.json();
  }

  async getSuscripciones() {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/subscriptions/my-subscriptions`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get subscriptions');
    }

    return response.json();
  }

  // API para notificaciones
  async getNotifications() {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/notifications/my-notifications`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get notifications');
    }

    return response.json();
  }

  async markNotificationAsRead(notificationId: number) {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/mark-read`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark notification as read');
    }

    return response.json();
  }

  // API para progreso
  async getMyProgress() {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/progress/my-progress`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get progress');
    }

    return response.json();
  }

  async markLessonAsCompleted(lessonId: number) {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/progress/lesson/${lessonId}/complete`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark lesson as completed');
    }

    return response.json();
  }
}

export const paymentsAPI = new PaymentsAPI();
