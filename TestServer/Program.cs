var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });    
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Apply CORS middleware
app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.MapGet("/", () =>
{
    return new ArenaApiResponse { Message = "What you doing" };
});

app.MapGet("/pit", () =>
{
    return new ArenaApiResponse { Message = "pit triggered" };
})
.WithOpenApi();

app.MapGet("/flipper", () =>
{
    return new ArenaApiResponse { Message = "flipper triggered" };
})
.WithOpenApi();

for (int i = 1; i <= 3; i++)
{
    app.MapGet($"/spinner{i}off", () =>
    {
        return new ArenaApiResponse { Message = "spinner off" };
    })
    .WithOpenApi();

    app.MapGet($"/spinner{i}clockwise", () =>
    {
        return new ArenaApiResponse { Message = "spinner on" };
    })
    .WithOpenApi();

    app.MapGet($"/spinner{i}counterclockwise", () =>
    {
        return new ArenaApiResponse { Message = "spinner on" };
    })
    .WithOpenApi();
}

app.MapGet("/start", () =>
{
    return new ArenaApiResponse { Message = "match started" };
})
.WithOpenApi();

app.MapGet("/stop", () =>
{
    return new ArenaApiResponse { Message = "match stop flag set" };
})
.WithOpenApi();

app.MapGet("/start180", () =>
{
    return new ArenaApiResponse { Message = "match started" };
})
.WithOpenApi();



app.Run();
