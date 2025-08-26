import React, { useState, useEffect } from 'react';
import { PersonalityTest } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Brain, Calendar, Edit, Trash2, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';

export default function PersonalityTests() {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      const fetchedTests = await PersonalityTest.list('-date_taken');
      setTests(fetchedTests);
    } catch (error) {
      console.error("Error loading personality tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test result? This action cannot be undone.")) {
      try {
        await PersonalityTest.delete(testId);
        loadTests();
      } catch (error) {
        console.error("Error deleting test:", error);
        alert("Failed to delete the test. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-secondary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-h1 flex items-center gap-3">
              <Brain className="w-8 h-8 text-[var(--brand-primary)]" />
              Personality Tests
            </h1>
            <p className="text-body-large text-text-secondary mt-1">Your personality assessments and psychological profiles.</p>
          </div>
          <Link to={createPageUrl("NewPersonalityTest")}>
            <Button className="btn-primary w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Test Result
            </Button>
          </Link>
        </div>

        {tests.length === 0 ? (
          <div className="text-center py-20 base-card">
            <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border-color)]">
              <Brain className="w-12 h-12 text-text-muted" />
            </div>
            <h2 className="text-h2">No Tests Found</h2>
            <p className="text-body-large max-w-lg mx-auto">
              Add your first personality test result to start discovering deeper insights about yourself.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
              <Card key={test.id} className="base-card flex flex-col justify-between">
                <div>
                  <CardHeader className="flex flex-row items-start justify-between pb-4">
                    <div className="flex-1">
                      <CardTitle className="text-h3">{test.test_name}</CardTitle>
                      <Badge variant="outline" className="mt-2 text-xs text-[var(--brand-primary)] border-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.4)] bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.1)]">
                        {test.test_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 btn-secondary" onClick={() => navigate(createPageUrl(`EditPersonalityTest?id=${test.id}`))}>
                           <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600" onClick={() => handleDelete(test.id)}>
                           <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-[var(--text-secondary)]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Taken on {format(new Date(test.date_taken), 'MMMM d, yyyy')}</span>
                    </div>
                     {test.is_primary && (
                        <div className="flex items-center text-sm text-amber-600 mt-2">
                            <Star className="w-4 h-4 mr-2 fill-current" />
                            <span>Primary result for this test type</span>
                        </div>
                    )}
                  </CardContent>
                </div>
                <CardFooter>
                  <Button variant="outline" className="w-full btn-secondary" onClick={() => navigate(createPageUrl(`EditPersonalityTest?id=${test.id}`))}>View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}