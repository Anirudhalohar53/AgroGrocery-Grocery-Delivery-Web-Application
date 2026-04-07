@echo off
echo Starting AgroGrocery Backend...
echo.

REM Check if Java is available
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

REM Set classpath with all JAR files in target/lib
set CLASSPATH=target/classes
for %%f in (target\lib\*.jar) do (
    set CLASSPATH=!CLASSPATH!;%%f
)

echo Starting application...
java -cp "%CLASSPATH%" com.agrogrocery.AgroGroceryApplication

pause
