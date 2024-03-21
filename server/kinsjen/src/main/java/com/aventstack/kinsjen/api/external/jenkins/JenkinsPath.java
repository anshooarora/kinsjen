package com.aventstack.kinsjen.api.external.jenkins;

public class JenkinsPath {
    
    public static String API_JSON = "/api/json";
    public static String TEST_REPORT = "/testReport/" + API_JSON;

    public static String withDepth(final short depth, final String uri) {
        final String depthParam = "depth=" + depth;
        return uri.contains("?") ? uri.concat("&" + depthParam) : uri.concat("?" + depthParam);
    }

}
