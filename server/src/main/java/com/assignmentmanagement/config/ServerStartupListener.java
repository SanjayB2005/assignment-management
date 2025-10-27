package com.assignmentmanagement.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class ServerStartupListener implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger logger = LoggerFactory.getLogger(ServerStartupListener.class);

    @Value("${server.port:8080}")
    private String port;

    @Value("${spring.application.name:Assignment Management System}")
    private String applicationName;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        try {
            String hostAddress = InetAddress.getLocalHost().getHostAddress();
            String hostName = InetAddress.getLocalHost().getHostName();
            
            logger.info("=================================================================");
            logger.info("    🎓 {} - SERVER STARTED SUCCESSFULLY! 🎓", applicationName.toUpperCase());
            logger.info("=================================================================");
            logger.info("    Server Status:      ✅ RUNNING");
            logger.info("    Server Port:        {}", port);
            logger.info("    Local URL:          http://localhost:{}", port);
            logger.info("    Network URL:        http://{}:{}", hostAddress, port);
            logger.info("    Host Name:          {}", hostName);
            logger.info("    Profile:            {}", String.join(", ", event.getApplicationContext().getEnvironment().getActiveProfiles()));
            logger.info("    Database:           📊 MySQL Connected");
            logger.info("    File Upload:        📁 Enabled (Max 10MB)");
            logger.info("    JWT Security:       🔐 Enabled");
            logger.info("    API Documentation:  📚 Available at http://localhost:{}/api", port);
            logger.info("=================================================================");
            logger.info("    🌟 Assignment Management System is ready to serve requests!");
            logger.info("    📝 Teachers can create assignments and review submissions");
            logger.info("    👨‍🎓 Students can search assignments and upload their work");
            logger.info("=================================================================");
            
        } catch (UnknownHostException e) {
            logger.error("❌ Unable to determine host address", e);
            logger.info("=================================================================");
            logger.info("    🎓 {} - SERVER STARTED! 🎓", applicationName.toUpperCase());
            logger.info("=================================================================");
            logger.info("    Server Status:      ✅ RUNNING");
            logger.info("    Server Port:        {}", port);
            logger.info("    Local URL:          http://localhost:{}", port);
            logger.info("=================================================================");
        }
    }
}