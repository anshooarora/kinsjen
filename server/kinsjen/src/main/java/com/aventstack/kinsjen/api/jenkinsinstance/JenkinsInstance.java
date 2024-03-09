package com.aventstack.kinsjen.api.jenkinsinstance;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "jenkins_instance")
public class JenkinsInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt = new Date();

    @NotBlank(message = "Missing mandatory field 'name'")
    private String name;

    @NotBlank(message = "Missing mandatory field 'url'")
    private String url;

    private AutomationServerEnum type = AutomationServerEnum.JENKINS;

    @JsonDeserialize(using = AutomationServerEnumDeserializer.class)
    public enum AutomationServerEnum {
        UNSUPPORTED_AUTOMATION_SERVER("UnsupportedAutomationServer"),
        JENKINS("Jenkins");

        private final String _value;

        AutomationServerEnum(final String value) {
            _value = value;
        }

        @JsonCreator
        public static AutomationServerEnum fromString(final String key) {
            if (null == key) {
                return null;
            }

            for (final AutomationServerEnum value : AutomationServerEnum.values()) {
                if (key.equalsIgnoreCase(value.toString())) {
                    return value;
                }
            }

            return AutomationServerEnum.values()[0];
        }

        public static List<AutomationServerEnum> validValues() {
            return Arrays.stream(AutomationServerEnum.values())
                    .filter(x -> !x.equals(UNSUPPORTED_AUTOMATION_SERVER))
                    .collect(Collectors.toUnmodifiableList());
        }

        @Override
        @JsonValue
        public String toString() {
            return _value;
        }

    }

    private static class AutomationServerEnumDeserializer extends StdDeserializer<AutomationServerEnum> {

        public AutomationServerEnumDeserializer() {
            super(AutomationServerEnumDeserializer.class);
        }

        @Override
        public AutomationServerEnum deserialize(final JsonParser jsonParser, final DeserializationContext context) throws IOException {
            final JsonNode jsonNode = jsonParser.getCodec().readTree(jsonParser);
            return AutomationServerEnum.fromString(jsonNode.toString().replace("\"", ""));
        }

    }

}
