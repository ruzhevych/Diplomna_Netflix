using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class FixAdminMessagesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "AdminMessages",
                newName: "Subject");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "IsSent",
                table: "AdminMessages");

            migrationBuilder.RenameColumn(
                name: "Subject",
                table: "AdminMessages",
                newName: "Title");
        }
    }
}
