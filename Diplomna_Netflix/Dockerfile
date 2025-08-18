# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Копіюємо проект і відновлюємо залежності
COPY ["Diplomna_Netflix/Diplomna_Netflix.csproj", "Diplomna_Netflix/"]
RUN dotnet restore "Diplomna_Netflix/Diplomna_Netflix.csproj"

# Копіюємо всі файли і будуємо додаток
COPY . .
WORKDIR /source/Diplomna_Netflix
RUN dotnet publish -c Release -o /app

# Stage 2: Final image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0

# Встановлюємо необхідні пакети для підключення до PostgreSQL
WORKDIR /app

# Копіюємо додаток з етапу побудови
COPY --from=build /app .

# Запускаємо додаток
ENTRYPOINT ["dotnet", "Diplomna_Netflix.dll"]
