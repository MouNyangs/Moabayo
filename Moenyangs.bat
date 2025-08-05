@echo off
setlocal
set BASE_PATH=E:\moabayo

rem 1. Eureka 서버 실행
pushd Moabayo_Eureka_Server
start "" cmd /c "mvnw.cmd spring-boot:run"
popd
call :waitForPort 8012
echo done > %BASE_PATH%\step1.done

rem 2. Bank 서버 실행
pushd Moabayo_Client_Bank
start "" cmd /c "mvnw.cmd spring-boot:run"
popd
call :waitForPort 8813
echo done > %BASE_PATH%\step2.done

rem 3. Card 서버 실행
pushd Moabayo_Client_Card
start "" cmd /c "mvnw.cmd spring-boot:run"
popd
call :waitForPort 8814
echo done > %BASE_PATH%\step3.done

rem 4. LoginService 서버 실행
pushd Moabayo_Client_LoginService
start "" cmd /c "mvnw.cmd spring-boot:run"
popd
call :waitForPort 8811
echo done > %BASE_PATH%\step4.done

rem 5. Admin 서버 실행
pushd Moabayo_Client_Admin
start "" cmd /c "mvnw.cmd spring-boot:run"
popd
call :waitForPort 8815
echo done > %BASE_PATH%\step5.done

rem 6. Main 서버 실행
pushd Moabayo_Client_Main
start "" cmd /c "mvnw.cmd spring-boot:run"
popd
call :waitForPort 8812
echo done > %BASE_PATH%\step6.done

echo 모든 서비스 실행 완료
pause
exit /b

:waitForPort
setlocal
set PORT=%1
echo %PORT% 포트 오픈 대기 중...
:waitloop
powershell -Command ^
    "(new-object System.Net.Sockets.TcpClient).ConnectAsync('localhost',%PORT%).Wait(1000)" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 >nul
    goto waitloop
)
echo %PORT% 포트가 열렸습니다.
endlocal
exit /b