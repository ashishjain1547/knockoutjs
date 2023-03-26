package customDBPackage;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DBHelper {
    public Connection conn = null;
    public PreparedStatement pst = null;
    public CallableStatement cst = null;
    public ResultSet rset = null;
    
    public DBHelper(){
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            conn = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521/orcl", "c##user", "c##user");
            //conn = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521/orcl", "c##user", "c##user");
            //conn = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521/pdborcl", "imasowner", "imasowner");
        } catch (ClassNotFoundException | SQLException ex) {
            Logger.getLogger(DBHelper.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    public void dbClose(){
        try {
           if(pst!=null) pst.close();
           if(rset!=null) rset.close();
           if(conn!=null) conn.close();
           if(cst!=null) cst.close();
        } catch (SQLException ex) {
            Logger.getLogger(DBHelper.class.getName()).log(Level.SEVERE, null, ex);
        }
    
    }
    
}
