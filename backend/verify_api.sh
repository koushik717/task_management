#!/bin/bash

# 1. Login
echo "Logging in..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Login Failed"
    exit 1
fi
echo "Token Acquired"

# 2. Create Project
echo "\nCreating Project 'Curl Project'..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Curl Project","description":"Created via curl script"}')

# Extract ID using grep/sed simply (ignoring robust generic json parsing for this quick check)
PROJECT_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$PROJECT_ID" ]; then
    echo "Project Creation Failed: $RESPONSE"
    exit 1
fi
echo "Project Created with ID: $PROJECT_ID"

# 3. Create Task
echo "\nCreating Task in Project $PROJECT_ID..."
TASK_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/tasks/project/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Curl Task","description":"Task via curl","priority":"HIGH","dueDate":"2025-12-31 23:59:59"}')

if [[ $TASK_RESPONSE == *"id"* ]]; then
    echo "Task Created Successfully: $TASK_RESPONSE"
else
    echo "Task Creation Failed: $TASK_RESPONSE"
    exit 1
fi

# 4. Update Profile
echo "\nUpdating Profile Name to 'Admin API Verified'..."
UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin API Verified"}')

if [[ $UPDATE_RESPONSE == *"Admin API Verified"* ]]; then
    echo "Profile Updated Successfully: $UPDATE_RESPONSE"
else
    echo "Profile Update Failed: $UPDATE_RESPONSE"
    exit 1
fi

echo "\nALL CHECKS PASSED ✅"
