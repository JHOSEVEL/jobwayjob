@echo off
cd /d "C:\Users\josev\Desktop\Jobwayjob\jobway0000008"
"C:\Program Files\Git\bin\git.exe" config user.name "Jose"
"C:\Program Files\Git\bin\git.exe" config user.email "josevelmma5@gmail.com"
"C:\Program Files\Git\bin\git.exe" add -A
"C:\Program Files\Git\bin\git.exe" commit -m "Remove Supabase and database related files"
"C:\Program Files\Git\bin\git.exe" push origin main
pause
