package customPackage;

import customDBPackage.DBHelper;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import oracle.jdbc.OracleTypes;
import org.json.simple.JSONObject;

public class SaveCustomerData extends HttpServlet {
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            Enumeration<String> parameterNames = request.getParameterNames();
            while (parameterNames.hasMoreElements()) {
                String paramName = parameterNames.nextElement();
                System.out.print("Name: " + paramName + "; ");
                String[] paramValues = request.getParameterValues(paramName);
                for (String paramValue : paramValues) {
                    System.out.println("Value: " + paramValue);
                }
            }
            
            int id = Integer.parseInt(request.getParameter("id"));
            String name = request.getParameter("name");
            String contactName = request.getParameter("contactname");
            String address = request.getParameter("address");
            String dbaction = request.getParameter("dbaction");
            
            DBHelper dbh = new DBHelper();
            dbh.cst = dbh.conn.prepareCall("call save_customer_data(?,?,?,?,?,?)");
            dbh.cst.setInt(1, id);
            dbh.cst.setString(2, name);
            dbh.cst.setString(3, contactName);
            dbh.cst.setString(4, address);
            dbh.cst.setString(5, dbaction); //'Insert' for normal mode, 'Update' for edit mode
            dbh.cst.registerOutParameter(6, OracleTypes.NUMBER);
            dbh.cst.execute();
            
            System.out.println("### OUT_MESSAGE: " + dbh.cst.getInt(6));
            
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("OUT_MESSAGE", dbh.cst.getInt(6));
            out.println(jsonObject);
            out.flush();
            out.close();
            
        } catch (SQLException ex) {
            Logger.getLogger(SaveCustomerData.class.getName()).log(Level.SEVERE, null, ex);
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
