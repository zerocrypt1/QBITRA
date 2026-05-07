package models

type Problem struct {
	BaseModel       `bson:",inline"`
	Title           string   `bson:"title" json:"title"`
	Slug            string   `bson:"slug" json:"slug"`
	Statement       string   `bson:"statement" json:"statement"`
	Difficulty      string   `bson:"difficulty" json:"difficulty"`
	Tags            []string `bson:"tags" json:"tags"`
	Editorial       string   `bson:"editorial" json:"editorial"`
	HiddenTestCases []string `bson:"hidden_test_cases" json:"-"`
	IsPublic        bool     `bson:"is_public" json:"is_public"`
	AuthorID        string   `bson:"author_id" json:"author_id"`
}
