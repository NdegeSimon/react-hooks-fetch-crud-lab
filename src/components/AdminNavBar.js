import React from "react";

function AdminNavBar({ onChangePage, currentPage = "List" }) {
  const handleNavigation = (page) => {
    onChangePage(page);
  };

  return (
    <nav className="admin-navbar" role="navigation" aria-label="Admin navigation">
      <div className="navbar-container">
        <h1 className="navbar-title">Quiz Admin</h1>
        <div className="navbar-buttons">
          <button
            onClick={() => handleNavigation("Form")}
            className={`nav-button ${currentPage === "Form" ? "active" : ""}`}
            aria-current={currentPage === "Form" ? "page" : undefined}
            type="button"
          >
            <span className="button-icon">+</span>
            New Question
          </button>
          <button
            onClick={() => handleNavigation("List")}
            className={`nav-button ${currentPage === "List" ? "active" : ""}`}
            aria-current={currentPage === "List" ? "page" : undefined}
            type="button"
          >
            <span className="button-icon">📋</span>
            View Questions
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavBar;
