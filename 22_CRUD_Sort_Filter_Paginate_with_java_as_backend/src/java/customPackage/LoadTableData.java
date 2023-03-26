package customPackage;

import customDBPackage.DBHelper;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class LoadTableData extends HttpServlet {
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            DBHelper dbh = new DBHelper();
            
            dbh.pst = dbh.conn.prepareStatement("select customerid, customername, contactname, address, "
                    + "city, postalcode, country from ss_customers order by customerid");
            dbh.rset = dbh.pst.executeQuery();
            
            JSONArray jsonArray = new JSONArray();
            
            while(dbh.rset.next()){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", dbh.rset.getInt(1));
                jsonObject.put("name", dbh.rset.getString(2));
                jsonObject.put("contactname", dbh.rset.getString(3));
                jsonObject.put("address", dbh.rset.getString(4));
                jsonObject.put("city", dbh.rset.getString(5));
                jsonObject.put("postalcode", dbh.rset.getString(6));
                jsonObject.put("country", dbh.rset.getString(7));
                jsonArray.add(jsonObject);
            }
            
            out.print(jsonArray);
            out.flush();
            out.close();
            
        } catch (SQLException ex) {
            Logger.getLogger(LoadTableData.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
