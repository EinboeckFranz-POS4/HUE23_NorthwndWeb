//----------------------------------------
// .Net Core WebApi project create script 
//           v6.1.1 from 2022-04-04
//   (C)Robert Grueneis/HTL Grieskirchen 
//----------------------------------------

using Microsoft.AspNetCore.Diagnostics;
using Microsoft.OpenApi.Models;

string corsKey = "_myCorsKey";
string swaggerVersion = "v1";
string swaggerTitle = "NorthwndBackend";

var builder = WebApplication.CreateBuilder(args);

#region -------------------------------------------- ConfigureServices
builder.Services.AddControllers();
builder.Services
  .AddEndpointsApiExplorer()
  .AddSwaggerGen(x => x.SwaggerDoc(
    swaggerVersion,
    new OpenApiInfo { Title = swaggerTitle, Version = swaggerVersion }
  ))
  .AddCors(options => options.AddPolicy(
    corsKey,
    x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
  ));

string connectionString = builder.Configuration.GetConnectionString("NORTHWND");
Console.WriteLine($"******** ConnectionString: {connectionString}");
builder.Services.AddDbContext<NORTHWNDContext>(options => options.UseSqlServer(connectionString));
#endregion

var app = builder.Build();

#region -------------------------------------------- Middleware pipeline
if (app.Environment.IsDevelopment())
{
	app.UseDeveloperExceptionPage();
	Console.WriteLine("******** Swagger enabled: http://localhost:5000/swagger (to set as default route: see launchsettings.json)");
	app.UseSwagger();
	app.UseSwaggerUI(x => x.SwaggerEndpoint( $"/swagger/{swaggerVersion}/swagger.json", swaggerTitle));
}

app.UseCors(corsKey);

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

//app.UseExceptionHandler(config =>
//{
//  config.Run(async context =>
//  {
//    context.Response.StatusCode = 500;
//    context.Response.ContentType = "application/json";
//    var error = context.Features.Get<IExceptionHandlerFeature>();
//    if (error != null)
//    {
//      await context.Response.WriteAsync(
//        $"Exception: {error.Error?.Message} {error.Error?.InnerException?.Message}");
//    }
//  });
//});

app.MapControllers();
#endregion

app.Run();
