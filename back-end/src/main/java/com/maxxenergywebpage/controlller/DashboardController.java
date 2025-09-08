package com.maxxenergywebpage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    // Admin dashboard data
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // User statistics
        dashboardData.put("totalUsers", 42);
        dashboardData.put("activeUsers", 38);
        dashboardData.put("usersByRole", Map.of(
            "ADMIN", 3,
            "ENGINNER", 15,
            "EMPLOYEE", 24
        ));
        
        // System statistics
        dashboardData.put("systemStatus", "Healthy");
        dashboardData.put("lastBackup", "2023-08-25 03:00 AM");
        dashboardData.put("pendingUpdates", 2);
        
        // Recent activities
        dashboardData.put("recentActivities", List.of(
            Map.of(
                "user", "engineer1",
                "action", "Updated project documentation",
                "timestamp", "2023-08-25 14:32:45"
            ),
            Map.of(
                "user", "admin",
                "action", "Added new user account",
                "timestamp", "2023-08-25 11:15:22"
            ),
            Map.of(
                "user", "employee1",
                "action", "Submitted time-off request",
                "timestamp", "2023-08-24 16:45:10"
            )
        ));
        
        return ResponseEntity.ok(dashboardData);
    }
    
    // Engineer dashboard data
    @GetMapping("/engineer")
    public ResponseEntity<Map<String, Object>> getEngineerDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Project statistics
        dashboardData.put("activeProjects", 8);
        dashboardData.put("completedProjects", 12);
        dashboardData.put("upcomingDeadlines", 3);
        
        // Equipment status
        dashboardData.put("equipmentStatus", Map.of(
            "operational", 24,
            "maintenance", 3,
            "offline", 1
        ));
        
        // Recent documents
        dashboardData.put("recentDocuments", List.of(
            Map.of(
                "title", "Turbine Maintenance Guide",
                "lastUpdated", "2023-08-24",
                "updatedBy", "enginner1"
            ),
            Map.of(
                "title", "Solar Panel Installation Specs",
                "lastUpdated", "2023-08-22",
                "updatedBy", "enginner2"
            ),
            Map.of(
                "title", "Energy Storage System Design",
                "lastUpdated", "2023-08-20",
                "updatedBy", "enginner1"
            )
        ));
        
        // Maintenance schedule
        dashboardData.put("upcomingMaintenance", List.of(
            Map.of(
                "equipment", "Wind Turbine #3",
                "scheduledDate", "2023-08-28",
                "assignedTo", "enginner1"
            ),
            Map.of(
                "equipment", "Solar Array B",
                "scheduledDate", "2023-08-30",
                "assignedTo", "enginner2"
            )
        ));
        
        return ResponseEntity.ok(dashboardData);
    }
    
    // Employee dashboard data
    @GetMapping("/employee")
    public ResponseEntity<Map<String, Object>> getEmployeeDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Task statistics
        dashboardData.put("assignedTasks", 5);
        dashboardData.put("completedTasks", 12);
        dashboardData.put("upcomingDeadlines", 2);
        
        // Time tracking
        dashboardData.put("hoursThisWeek", 32);
        dashboardData.put("hoursLastWeek", 40);
        dashboardData.put("overtimeHours", 2);
        
        // Recent tasks
        dashboardData.put("recentTasks", List.of(
            Map.of(
                "title", "Data entry for new clients",
                "status", "In Progress",
                "dueDate", "2023-08-28"
            ),
            Map.of(
                "title", "Update customer contact information",
                "status", "Completed",
                "dueDate", "2023-08-24"
            ),
            Map.of(
                "title", "Prepare monthly report",
                "status", "Not Started",
                "dueDate", "2023-08-31"
            )
        ));
        
        // Time off requests
        dashboardData.put("timeOffRequests", List.of(
            Map.of(
                "startDate", "2023-09-15",
                "endDate", "2023-09-20",
                "status", "Pending"
            ),
            Map.of(
                "startDate", "2023-08-05",
                "endDate", "2023-08-10",
                "status", "Approved"
            )
        ));
        
        return ResponseEntity.ok(dashboardData);
    }
}
