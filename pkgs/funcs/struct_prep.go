package funcs

type Post_json struct {
	User_ID       string   `json:"user_id"`
	Title         string   `json:"title"`
	Text          string   `json:"text"`
	Category      []string `json:"category"`
	Edited        bool     `json:"edited"`
	Creation_Date string   `json:"creation_date"`
	Likes_Count   int      `json:"likes_count"`
}
