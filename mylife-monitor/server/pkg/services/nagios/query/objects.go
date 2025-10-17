package query

type queryResult[T any] struct {
	FormatVersion int    `json:"format_version"`
	Result        result `json:"result"`
	Data          T      `json:"data"`
}

type result struct {
	QueryTime      int64  `json:"query_time"`
	CGI            string `json:"cgi"`
	User           string `json:"user"`
	Query          string `json:"query"`
	QueryStatus    string `json:"query_status"`
	ProgramStart   int64  `json:"program_start"`
	LastDataUpdate int64  `json:"last_data_update"`
	TypeCode       int    `json:"type_code"`
	TypeText       string `json:"type_text"`
	Message        string `json:"message"`
}

type HostGroupList struct {
	Selectors     map[string]any       `json:"selectors"`
	HostGroupList map[string]HostGroup `json:"hostgrouplist"`
}

type HostGroup struct {
	GroupName string   `json:"group_name"`
	Alias     string   `json:"alias"`
	Members   []string `json:"members"`
	Notes     string   `json:"notes"`
	NotesUrl  string   `json:"notes_url"`
	ActionUrl string   `json:"action_url"`
}

type HostList struct {
	Selectors map[string]any  `json:"selectors"`
	HostList  map[string]Host `json:"hostlist"`
}

type Host struct {
	Name                       string  `json:"name"`
	PluginOutput               string  `json:"plugin_output"`
	LongPluginOutput           string  `json:"long_plugin_output"`
	PerfData                   string  `json:"perf_data"`
	Status                     int     `json:"status"`
	LastUpdate                 int64   `json:"last_update"`
	HasBeenChecked             bool    `json:"has_been_checked"`
	ShouldBeScheduled          bool    `json:"should_be_scheduled"`
	CurrentAttempt             int     `json:"current_attempt"`
	MaxAttempts                int     `json:"max_attempts"`
	LastCheck                  int64   `json:"last_check"`
	NextCheck                  int64   `json:"next_check"`
	CheckOptions               int     `json:"check_options"`
	CheckType                  int     `json:"check_type"`
	LastStateChange            int64   `json:"last_state_change"`
	LastHardStateChange        int64   `json:"last_hard_state_change"`
	LastHardState              int     `json:"last_hard_state"`
	LastTimeUp                 int64   `json:"last_time_up"`
	LastTimeDown               int64   `json:"last_time_down"`
	LastTimeUnreachable        int64   `json:"last_time_unreachable"`
	StateType                  int     `json:"state_type"`
	LastNotification           int64   `json:"last_notification"`
	NextNotification           int64   `json:"next_notification"`
	NoMoreNotifications        bool    `json:"no_more_notifications"`
	NotificationsEnabled       bool    `json:"notifications_enabled"`
	ProblemHasBeenAcknowledged bool    `json:"problem_has_been_acknowledged"`
	AcknowledgementType        int     `json:"acknowledgement_type"`
	CurrentNotification_number int     `json:"current_notification_number"`
	AcceptPassiveChecks        bool    `json:"accept_passive_checks"`
	Event_handlerEnabled       bool    `json:"event_handler_enabled"`
	ChecksEnabled              bool    `json:"checks_enabled"`
	FlapDetectionEnabled       bool    `json:"flap_detection_enabled"`
	IsFlapping                 bool    `json:"is_flapping"`
	PercentStateChange         float64 `json:"percent_state_change"`
	Latency                    float64 `json:"latency"`
	ExecutionTime              float64 `json:"execution_time"`
	ScheduledDowntimeDepth     int     `json:"scheduled_downtime_depth"`
	ProcessPerformanceData     bool    `json:"process_performance_data"`
	Obsess                     bool    `json:"obsess"`
}

type ServiceList struct {
	Selectors   map[string]any                `json:"selectors"`
	ServiceList map[string]map[string]Service `json:"servicelist"`
}

type Service struct {
	HostName                   string  `json:"host_name"`
	Description                string  `json:"description"`
	PluginOutput               string  `json:"plugin_output"`
	LongPluginOutput           string  `json:"long_plugin_output"`
	PerfData                   string  `json:"perf_data"`
	MaxAttempts                int     `json:"max_attempts"`
	CurrentAttempt             int     `json:"current_attempt"`
	Status                     int     `json:"status"`
	LastUpdate                 int64   `json:"last_update"`
	HasBeenChecked             bool    `json:"has_been_checked"`
	ShouldBeScheduled          bool    `json:"should_be_scheduled"`
	LastCheck                  int64   `json:"last_check"`
	NextCheck                  int64   `json:"next_check"`
	CheckOptions               int     `json:"check_options"`
	CheckType                  int     `json:"check_type"`
	ChecksEnabled              bool    `json:"checks_enabled"`
	LastStateChange            int64   `json:"last_state_change"`
	LastHardStateChange        int64   `json:"last_hard_state_change"`
	LastHardState              int     `json:"last_hard_state"`
	LastTimeOk                 int64   `json:"last_time_ok"`
	LastTimeWarning            int64   `json:"last_time_warning"`
	LastTimeUnknown            int64   `json:"last_time_unknown"`
	LastTimeCritical           int64   `json:"last_time_critical"`
	StateType                  int     `json:"state_type"`
	LastNotification           int64   `json:"last_notification"`
	NextNotification           int64   `json:"next_notification"`
	NoMoreNotifications        bool    `json:"no_more_notifications"`
	NotificationsEnabled       bool    `json:"notifications_enabled"`
	ProblemHasBeenAcknowledged bool    `json:"problem_has_been_acknowledged"`
	AcknowledgementType        int     `json:"acknowledgement_type"`
	CurrentNotification_number int     `json:"current_notification_number"`
	AcceptPassiveChecks        bool    `json:"accept_passive_checks"`
	Event_handlerEnabled       bool    `json:"event_handler_enabled"`
	FlapDetectionEnabled       bool    `json:"flap_detection_enabled"`
	IsFlapping                 bool    `json:"is_flapping"`
	PercentStateChange         float64 `json:"percent_state_change"`
	Latency                    float64 `json:"latency"`
	ExecutionTime              float64 `json:"execution_time"`
	ScheduledDowntimeDepth     int     `json:"scheduled_downtime_depth"`
	ProcessPerformanceData     bool    `json:"process_performance_data"`
	Obsess                     bool    `json:"obsess"`
}
