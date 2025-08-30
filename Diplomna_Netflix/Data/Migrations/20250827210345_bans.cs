using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class bans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdminMessageEntity_AspNetUsers_UserId",
                table: "AdminMessageEntity");

            migrationBuilder.RenameTable(
                name: "AdminMessageEntity",
                newName: "AdminMessages");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "AdminMessages",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "AdminMessages",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "AdminMessages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsSent",
                table: "AdminMessages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "AdminMessages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "SentAt",
                table: "AdminMessages",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "AdminMessages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AdminMessages",
                table: "AdminMessages",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "AdminBans",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    AdminId = table.Column<long>(type: "bigint", nullable: true),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminBans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdminBans_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminMessages_UserId",
                table: "AdminMessages",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AdminBans_UserId",
                table: "AdminBans",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdminMessages_AspNetUsers_UserId",
                table: "AdminMessages",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdminMessages_AspNetUsers_UserId",
                table: "AdminMessages");

            migrationBuilder.DropTable(
                name: "AdminBans");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AdminMessages",
                table: "AdminMessages");

            migrationBuilder.DropIndex(
                name: "IX_AdminMessages_UserId",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "IsSent",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "Message",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "SentAt",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "Subject",
                table: "AdminMessages");

            migrationBuilder.RenameTable(
                name: "AdminMessages",
                newName: "AdminMessageEntity");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "AdminMessageEntity",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddForeignKey(
                name: "FK_AdminMessageEntity_AspNetUsers_UserId",
                table: "AdminMessageEntity",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
