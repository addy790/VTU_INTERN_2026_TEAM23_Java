package com.pat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

/**
 * Broadcasts real-time notifications to connected WebSocket clients (Feature 6).
 * Injected into NotificationService — no existing code paths are changed.
 */
@Service
public class WebSocketNotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Push a live notification payload to a specific user's WebSocket channel.
     * Frontend subscribes to /topic/notifications/{userId}
     */
    public void pushToUser(UUID userId, String title, String message, String type) {
        Map<String, String> payload = Map.of(
                "title", title,
                "message", message,
                "type", type,
                "timestamp", java.time.LocalDateTime.now().toString()
        );
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, payload);
    }
}
