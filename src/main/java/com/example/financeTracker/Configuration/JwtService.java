package com.example.financeTracker.Configuration;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService  {
    private static final String SECRET_KEY = "a317ad3a2b74551cdaf1cd8ba3572fef515f717ac8b90ce27c23ac4fd38393ab849baff682450392dd561a654ab99388fea799d1b41792eec0b2aa5b736cf76161616f17515983efa129e21f66fb5f054c87132153ac49f18dbd7007e3e0791af03aea04a96734e6516b24c1e2f01f3f8aeb5cfb02e63870cef7f6cddfa7300317a22cd7dfb2bc663a92a9d4374b513583b65f972b4a3d515f4aeeda1a9a94fd081f377d5188327e316e8faa9710a1daca1e37586c8fa95b7ec2c610aba7e51dc44f6f625b1dba780c76774c3b0516cb7f6ee42906579c4737337be7c4b487d33b1a02d3f136e63ecdb1cb3943f48b852482d94278d014e84acbef4b3a7818f1";

    public String extractUsername(String token) {
        return extractClaim(token,Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(),userDetails);
    }
    
    public String generateToken(Map<String,Object> extraClaims, UserDetails userDetails){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 120))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public boolean isTokenValid(String token,UserDetails userDetails){
        final String userName = extractUsername(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token,Claims::getExpiration);
    }

    private Claims extractAllClaims(String token){
        return Jwts
                .parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    

}
